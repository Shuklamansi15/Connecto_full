import React, { useContext, useEffect, useState } from 'react';
import { InfluencerContext } from '../../context/InfluencerContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ConfirmPopup from '../../components/ConfirmPopup';

const InfluencerConsultations = () => {

  const {
    iToken,
    consultations = [],   // prevent undefined crash
    getConsultations,
    cancelConsultation,
    completeConsultation
  } = useContext(InfluencerContext);

  const { slotDateFormat, currency } = useContext(AppContext);

  // -------------------- NEW POPUP STATE --------------------
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const openPopup = ({ title, message, onConfirm }) => {
    setPopupData({ title, message, onConfirm });
    setShowPopup(true);
  };
  // ----------------------------------------------------------

  useEffect(() => {
    if (iToken) getConsultations();
  }, [iToken]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";

    if (dateString.includes('_')) {
      return slotDateFormat(dateString);
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return slotDateFormat(date);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 p-4">
      
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        All Consultations
      </h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm text-sm max-h-[80vh] overflow-y-auto">

        {/* TABLE HEADER */}
        <div className="
          hidden sm:grid
          grid-cols-[0.5fr_2.5fr_1fr_2.5fr_1fr_1.5fr]
          gap-2 py-3 px-6 border-b bg-gray-50
          font-semibold text-gray-700 sticky top-0 z-10
        ">
          <p>#</p>
          <p>Client</p>
          <p className="text-center">Mode</p>
          <p>Date & Time</p>
          <p className="text-right">Amount</p>
          <p className="text-center">Action</p>
        </div>

        {consultations.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No consultations found.
          </p>
        ) : (

          consultations.map((item, index) => {

            const mode = item.mode || "Not Set";
            const amount = item.amount || 0;
            const user = item.userData || {};
            const userImage = user.image || assets.default_user;

            return (
              <div
                key={item._id || index}
                className="
                  flex flex-col sm:grid 
                  grid-cols-[0.5fr_2.5fr_1fr_2.5fr_1fr_1.5fr]
                  gap-2 items-center text-gray-600
                  py-4 px-6 border-b last:border-b-0
                  hover:bg-gray-50 transition duration-100
                "
              >

                {/* Index */}
                <p className="hidden sm:block text-gray-500">
                  {index + 1}
                </p>

                {/* USER */}
                <div className="flex items-center gap-3 w-full sm:w-auto sm:col-span-1">
                  <img
                    src={userImage}
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                    alt="User"
                  />
                  <p className="font-medium text-gray-800">
                    {user.name || "Unknown User"}
                  </p>
                </div>

                {/* MODE */}
                <div className="w-full sm:w-auto text-left sm:text-center">
                  <span className="
                    inline-block text-xs font-semibold uppercase 
                    px-2 py-0.5 rounded-full 
                    text-blue-700 bg-blue-100
                  ">
                    {mode}
                  </span>
                </div>

                {/* DATE & TIME */}
                <p className="w-full sm:w-auto text-left">
                  {formatDateForDisplay(item.slotDate)}, {item.slotTime || "N/A"}
                </p>

                {/* AMOUNT */}
                <p className="w-full sm:w-auto text-left sm:text-right font-medium text-gray-800">
                  {currency}{amount}
                </p>

                {/* ACTION BUTTONS (UPDATED) */}
                <div className="w-full sm:w-auto flex justify-start sm:justify-center items-center">

                  {item.cancelled ? (
                    <p className="text-red-500 text-sm font-semibold">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 text-sm font-semibold">Completed</p>
                  ) : (
                    <div className="flex gap-4">

                      {/* CANCEL */}
                      <FaTimesCircle
                        onClick={() =>
                          openPopup({
                            title: "Cancel Consultation?",
                            message: `Are you sure you want to cancel this consultation?`,
                            onConfirm: () => cancelConsultation(item._id)
                          })
                        }
                        className="w-7 h-7 cursor-pointer text-red-500 hover:opacity-70 transition"
                        title="Cancel Consultation"
                      />
                      
                      {/* COMPLETE */}
                      <FaCheckCircle
                        onClick={() =>
                          openPopup({
                            title: "Mark as Completed?",
                            message: `Have you completed this consultation?`,
                            onConfirm: () => completeConsultation(item._id)
                          })
                        }
                        className="w-7 h-7 cursor-pointer text-green-500 hover:opacity-70 transition"
                        title="Mark as Complete"
                      />

                    </div>
                  )}

                </div>

              </div>
            );
          })

        )}

      </div>

      {/* CONFIRM POPUP */}
      <ConfirmPopup
        isOpen={showPopup}
        title={popupData.title}
        message={popupData.message}
        onCancel={() => setShowPopup(false)}
        onConfirm={() => {
          popupData.onConfirm();
          setShowPopup(false);
        }}
      />

    </div>
  );
};

export default InfluencerConsultations;
