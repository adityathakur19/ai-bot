import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext'; // Import ThemeContext

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { darkMode } = useContext(ThemeContext); // Access darkMode from ThemeContext

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`rounded-lg shadow-lg p-6 max-w-md w-full transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
        }`}
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-md transition-colors ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
              darkMode
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;