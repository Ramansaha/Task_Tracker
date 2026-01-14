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
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
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
    if (messageType === "success") {
      return {
        container: "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-lg",
        icon: "text-green-500",
        text: "text-green-800",
        iconSvg: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      };
    } else {
      return {
        container: "bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 shadow-lg",
        icon: "text-red-500",
        text: "text-red-800",
        iconSvg: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      };
    }
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

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const res = await fetch(`/api/taskTrac/task/upadte/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          endDate: taskData.endDate,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchTasks();
        showMessage("Task updated successfully", "success");
        setIsEditTaskModalOpen(false);
        setEditingTask(null);
      } else {
        showMessage(data.message || "Failed to update task", "error");
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

      {message && (() => {
        const styles = getMessageStyle();
        return (
          <div className={`mb-4 px-4 py-3 rounded-lg flex items-center gap-3 animate-slide-down ${styles.container}`}>
            <div className={`flex-shrink-0 ${styles.icon}`}>
              {styles.iconSvg}
            </div>
            <p className={`flex-1 font-medium ${styles.text}`}>
              {message}
            </p>
            <button
              onClick={() => {
                setMessage("");
                setMessageType("");
              }}
              className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      })()}

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
            filteredTasks.map((task) => {
              const taskId = task.id ?? task._id;
              return (
                <div
                  key={taskId}
                  className="bg-white p-3 rounded-lg shadow flex justify-between items-start"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => toggleTaskExpand(taskId)}
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
                  {expandedTaskId === taskId && task.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {task.description}
                    </p>
                  )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleComplete(taskId, task.completed)}
                      className={`px-3 py-1 rounded-lg text-white min-w-[80px] text-center ${
                        task.completed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(taskId)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit task"
                      aria-label="Edit task"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLineCap="round"
                          strokeLineJoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
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

      <AddTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={(formData) => {
          if (!editingTask) return;
          const taskId = editingTask.id ?? editingTask._id;
          handleUpdateTask(taskId, formData);
        }}
        mode="edit"
        initialTask={editingTask}
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
