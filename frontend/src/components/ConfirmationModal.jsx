import React from "react";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message, title = "Confirm Action" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
          <p className="text-base text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

