import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filter, search]);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const getMessageStyle = () => {
    return messageType === "success"
      ? "bg-green-100 text-green-700 border-green-400"
      : "bg-red-100 text-red-700 border-red-400";
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/taskTrac/task/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data || []);
      } else {
        showMessage(data.message || "Failed to load tasks", "error");
      }
    } catch (err) {
      showMessage("Something went wrong while loading tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let tempTasks = [...tasks];
    if (filter === "completed") {
      tempTasks = tempTasks.filter((task) => task.completed);
    } else if (filter === "pending") {
      tempTasks = tempTasks.filter((task) => !task.completed);
    }
    if (search) {
      tempTasks = tempTasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredTasks(tempTasks);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!dueDate) {
      setMessageType("error");
      setMessage("Date is required!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }
    try {
      const res = await fetch("/api/taskTrac/task/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, dueDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle("");
        setDueDate("");
        fetchTasks();
        showMessage(data.message || "Task added successfully", "success");
      } else {
        showMessage(data.message || "Failed to add task", "error");
      }
    } catch (err) {
      showMessage("Error adding task", "error");
    }
  };

  const toggleComplete = async (taskId, completed) => {
    try {
      const res = await fetch(`/api/taskTrac/task/upadte/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      showMessage("Error updating task", "error");
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/taskTrac/task/delete/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchTasks();
        showMessage("Task deleted", "success");
      } else {
        showMessage("Failed to delete task", "error");
      }
    } catch (err) {
      showMessage("Error deleting task", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAddTask}
        className="bg-white p-4 rounded-lg shadow mb-4 flex gap-4"
      >
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </form>

      {message && (
        <div className={`mb-4 px-4 py-2 border rounded ${getMessageStyle()}`}>
          {message}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg ${filter === "completed" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-lg ${filter === "pending" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Pending
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 border rounded-lg"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h2
                    className={`text-lg font-medium ${
                      task.completed && filter !== "completed" ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h2>
                  {task.dueDate && (
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(task._id, task.completed)}
                    className={`px-3 py-1 rounded-lg text-white ${
                      task.completed
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks found.</p>
          )}
        </div>
      )}
    </div>
  );
}
