import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import AddTaskModal from "../components/AddTaskModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const showMessage = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  }, []);

  const fetchTasks = useCallback(async () => {
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
    } catch {
      showMessage("Something went wrong while loading tasks.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, showMessage]);

  const applyFilters = useCallback(() => {
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
  }, [tasks, filter, search]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, [token, navigate, fetchTasks]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getMessageStyle = () => {
    return messageType === "success"
      ? "bg-green-100 text-green-700 border-green-400"
      : "bg-red-100 text-red-700 border-red-400";
  };

  const handleAddTask = async (taskData) => {
    try {
      const res = await fetch("/api/taskTrac/task/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          startDate: taskData.startDate,
          endDate: taskData.endDate,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchTasks();
        showMessage(data.message || "Task added successfully", "success");
        setIsAddTaskModalOpen(false);
      } else {
        showMessage(data.message || "Failed to add task", "error");
      }
    } catch {
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
    } catch {
      showMessage("Error updating task", "error");
    }
  };

  const handleDeleteClick = (taskId) => {
    setTaskIdToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskIdToDelete) return;

    try {
      const res = await fetch(`/api/taskTrac/task/delete/${taskIdToDelete}`, {
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
    } catch {
      showMessage("Error deleting task", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setTaskIdToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTaskIdToDelete(null);
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create New Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

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
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-3 rounded-lg shadow flex justify-between items-start"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => toggleTaskExpand(task._id)}
                >
                  <h2
                    className={`text-base font-medium ${
                      task.completed && filter !== "completed" ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h2>
                  <div className="flex gap-4 mt-2">
                    {task.startDate && (
                      <p className="text-sm text-gray-500">
                        Start: {new Date(task.startDate).toLocaleDateString()}
                      </p>
                    )}
                    {task.endDate && (
                      <p className="text-sm text-gray-500">
                        End: {new Date(task.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {expandedTaskId === task._id && task.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {task.description}
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
                    onClick={() => handleDeleteClick(task._id)}
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

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSave={handleAddTask}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Do you want to delete this task?"
        title="Delete Task"
      />
    </div>
  );
}
