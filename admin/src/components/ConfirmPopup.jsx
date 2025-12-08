import React from 'react';
import { IoClose } from "react-icons/io5";

const ConfirmPopup = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you really want to perform this action?",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white w-[90%] max-w-sm p-6 rounded-xl shadow-lg relative">

        <IoClose
          className="absolute top-3 right-3 text-2xl cursor-pointer hover:text-red-500"
          onClick={onCancel}
        />

        <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
          {title}
        </h2>

        <p className="text-gray-600 text-center text-sm mb-5">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
