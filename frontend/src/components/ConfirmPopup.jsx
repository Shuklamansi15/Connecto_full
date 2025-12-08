import React from "react";
import { createRoot } from "react-dom/client";

const ConfirmPopup = (consultationId, callback) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  const close = () => {
    root.unmount();
    div.remove();
  };

  const confirm = () => {
    if (callback) callback(consultationId);
    close();
  };

  const PopupUI = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-lg font-bold mb-3 text-gray-800">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Do you want to cancel this consultation?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 rounded bg-blue-50 hover:bg-[#1999d5]"
          >
            No
          </button>
          <button
            onClick={confirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );

  root.render(<PopupUI />);
};

export default ConfirmPopup;
