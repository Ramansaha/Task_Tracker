import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import AddTaskModal from "../components/AddTaskModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const showMessage = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  }, []);

  const fetchTasks = useCallback(async (page = 1, filterParam = filter, startDateParam = startDate, endDateParam = endDate, searchTypeParam = searchType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        _t: Date.now().toString()
      });

      if (filterParam && filterParam !== 'all') {
        params.append('filter', filterParam);
      }

      if (searchTypeParam === 'dateRange') {
        if (startDateParam && startDateParam.trim() !== '') {
          params.append('startDate', startDateParam);
        }
        if (endDateParam && endDateParam.trim() !== '') {
          params.append('endDate', endDateParam);
        }
      } else {
        params.append('dateMode', 'all');
      }

      const res = await fetch(`/api/taskTrac/task/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache',
      });
      const data = await res.json();
      if (res.ok) {
        if (data.tasks && data.pagination) {
          setTasks(data.tasks);
          setPagination(data.pagination);
          setCurrentPage(page);
        } else {
          setTasks([]);
          setPagination(null);
        }
      } else {
        showMessage(data.message || "Failed to load tasks", "error");
      }
    } catch {
      showMessage("Something went wrong while loading tasks.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, showMessage, pageSize, filter, startDate, endDate, searchType]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
      fetchTasks(newPage, filter, startDate, endDate, searchType);
    }
  }, [fetchTasks, pagination, filter, startDate, endDate, searchType]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    fetchTasks(1, newFilter, startDate, endDate, searchType);
  }, [fetchTasks, startDate, endDate, searchType]);

  const handleDateChange = useCallback((newStartDate, newEndDate) => {
    setCurrentPage(1);
    const start = newStartDate !== undefined ? newStartDate : startDate;
    const end = newEndDate !== undefined ? newEndDate : endDate;
    fetchTasks(1, filter, start, end, searchType);
  }, [startDate, endDate, filter, fetchTasks, searchType]);

  const handleSearchTypeChange = useCallback((newType) => {
    setSearchType(newType);
    setIsFilterMenuOpen(false);
    setCurrentPage(1);
    if (newType === 'title') {
      setStartDate("");
      setEndDate("");
      fetchTasks(1, filter, "", "", newType);
    } else {
      fetchTasks(1, filter, startDate, endDate, newType);
    }
  }, [filter, fetchTasks, startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterMenuOpen && !event.target.closest('.filter-menu-container')) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const getDisplayTasks = useCallback(() => {
    let displayTasks = [...tasks];
    
    // Filter is now handled by backend, but we still apply search client-side
    if (search) {
      displayTasks = displayTasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return displayTasks;
  }, [tasks, search]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTasks(1, filter, startDate, endDate, searchType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

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
        fetchTasks(1, filter, startDate, endDate, searchType);
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
        fetchTasks(currentPage, filter, startDate, endDate, searchType);
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
        fetchTasks(currentPage, filter, startDate, endDate, searchType);
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
        const displayTasks = getDisplayTasks();
        const shouldGoToPreviousPage = pagination && currentPage > 1 && displayTasks.length === 1;
        const nextPage = shouldGoToPreviousPage ? currentPage - 1 : currentPage;
        fetchTasks(nextPage, filter, startDate, endDate, searchType);
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
          <div className="fixed bottom-4 right-4 z-50 flex justify-end w-full max-w-md">
            <div className={`max-w-md w-full px-4 py-3 rounded-lg flex items-center gap-3 animate-slide-down ${styles.container}`}>
              <div className={`flex-shrink-0 ${styles.icon}`}>
                {styles.iconSvg}
              </div>
              <p className={`flex-1 font-medium ${styles.text} text-sm`}>
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
          </div>
        );
      })()}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 rounded-lg ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("completed")}
            className={`px-3 py-1 rounded-lg ${filter === "completed" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Completed
          </button>
          <button
            onClick={() => handleFilterChange("pending")}
            className={`px-3 py-1 rounded-lg ${filter === "pending" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Pending
          </button>
        </div>

        <div className="flex items-center gap-2 filter-menu-container relative">
          {searchType === "title" ? (
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="px-3 py-1 border rounded-lg"
            />
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  if (newStartDate && (!endDate || newStartDate <= endDate)) {
                    setTimeout(() => handleDateChange(newStartDate, endDate), 100);
                  }
                }}
                className="px-3 py-1 border rounded-lg text-sm"
                placeholder="Start date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  setEndDate(newEndDate);
                  if (newEndDate && startDate && startDate <= newEndDate) {
                    setTimeout(() => handleDateChange(startDate, newEndDate), 100);
                  }
                }}
                min={startDate || undefined}
                className="px-3 py-1 border rounded-lg text-sm"
                placeholder="End date"
              />
            </div>
          )}
          
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            title="Filter options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>

          {isFilterMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => handleSearchTypeChange("title")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg ${
                  searchType === "title" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700"
                }`}
              >
                Title
              </button>
              <button
                onClick={() => handleSearchTypeChange("dateRange")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 last:rounded-b-lg ${
                  searchType === "dateRange" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700"
                }`}
              >
                Date Range
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {(() => {
                  const displayTasks = getDisplayTasks();
                  return displayTasks.length > 0 ? (
                    displayTasks.map((task) => {
                    const taskId = task.id ?? task._id;
                    return (
                      <tr 
                        key={taskId} 
                        className="hover:bg-indigo-50/50 transition-all duration-150 border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                task.completed && filter !== "completed"
                                  ? "line-through text-gray-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <div className="relative group">
                                <svg
                                  className="w-4 h-4 text-indigo-400 cursor-help hover:text-indigo-600 transition-colors"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700">
                                  <div className="font-medium mb-1">Description:</div>
                                  {task.description}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-sm text-gray-600 font-medium">
                            {task.startDate
                              ? new Date(task.startDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-sm text-gray-600 font-medium">
                            {task.endDate
                              ? new Date(task.endDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              task.completed
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {task.completed ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Pending
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => toggleComplete(taskId, task.completed)}
                              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 w-20 ${
                                task.completed
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300"
                                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300"
                              }`}
                            >
                              {task.completed ? "Undo" : "Complete"}
                            </button>
                            <button
                              onClick={() => handleDeleteClick(taskId)}
                              className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium transition-all duration-150 w-16"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEditClick(task)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-all duration-150 w-10 flex items-center justify-center"
                              title="Edit task"
                              aria-label="Edit task"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-gray-500 font-medium">No tasks found</p>
                        </div>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between mt-4 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              pagination.hasPrev
                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{pagination.currentPage}</span> of <span className="font-semibold text-gray-900">{pagination.totalPages}</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {pagination.totalItems} {pagination.totalItems === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              pagination.hasNext
                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            <span>Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
