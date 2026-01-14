import React, { useEffect, useState } from "react";

export default function AddTaskModal({ isOpen, onClose, onSave, mode = "create", initialTask = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialTask) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      const start = initialTask.startDate
        ? new Date(initialTask.startDate).toISOString().split("T")[0]
        : "";
      const end = initialTask.endDate
        ? new Date(initialTask.endDate).toISOString().split("T")[0]
        : "";
      setStartDate(start);
      setEndDate(end);
      setErrors({});
    } else {
      const today = new Date().toISOString().split("T")[0];
      setTitle("");
      setDescription("");
      setStartDate(today);
      setEndDate("");
      setErrors({});
    }
  }, [isOpen, mode, initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (mode === "create") {
      if (!startDate) {
        newErrors.startDate = "Start date is required";
      }
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
    });
  };

  if (!isOpen) return null;

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 border border-gray-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {isEdit ? "Edit Task" : "Create New Task"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isEdit}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                } ${isEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">
                  Start date cannot be changed after creation.
                </p>
              )}
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                {isEdit ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


