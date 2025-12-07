import React, { useContext, useEffect } from 'react'
import { InfluencerContext } from '../../context/InfluencerContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";


const InfluencerDashboard = () => {

  const { 
    iToken, 
    dashData, 
    getDashData, 
    cancelConsultation, 
    completeConsultation 
  } = useContext(InfluencerContext)

  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (iToken) {
      getDashData()
    }
  }, [iToken])

  if (!dashData || !dashData.latestConsultations) {
    return (
      <div className="p-5 text-center text-lg text-gray-500 animate-pulse">
        Loading Dashboard Data...
      </div>
    );
  }

  const latestConsultations = Array.isArray(dashData.latestConsultations)
    ? dashData.latestConsultations
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto my-6 p-4">

      {/* ===== HEADER ===== */}
      <h2 className="mb-6 text-2xl font-bold text-gray-800 tracking-wide">
        Dashboard Overview
      </h2>

      {/* ===== TOP CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5">

        {/* Card */}
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <img className="w-12 h-12" src={assets.earning_icon} alt="Earnings" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{currency} {dashData.earnings}</p>
            <p className="text-sm text-gray-500 mt-1">Total Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <img className="w-12 h-12" src={assets.appointments_icon} alt="Consultations" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{dashData.consultations}</p>
            <p className="text-sm text-gray-500 mt-1">Total Consultations</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <img className="w-12 h-12" src={assets.patients_icon} alt="Users" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{dashData.users}</p>
            <p className="text-sm text-gray-500 mt-1">Unique Users</p>
          </div>
        </div>

      </div>

      {/* ===== LATEST CONSULTATIONS ===== */}
      <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* Section Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 bg-gray-50 border-b">
          <img className="w-5 h-5" src={assets.list_icon} alt="List" />
          <p className="text-lg font-semibold text-gray-800">Latest Consultations</p>
        </div>

        <div className="divide-y divide-gray-100">

          {latestConsultations.slice(0, 5).map((item, index) => {

            const mode =
              item.mode ||
              item.consultationMode ||
              item.type ||
              "Unknown";

            return (
              <div
                className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-all"
                key={index}
              >

                {/* User Image */}
                <img
                  className="rounded-full w-12 h-12 object-cover border border-gray-300"
                  src={item.userData?.image || assets.default_user}
                  alt="Client avatar"
                />

                {/* Details */}
                <div className="flex-1 text-sm">

                  <p className="text-gray-900 font-semibold text-[15px]">
                    {item.userData?.name || "Unknown Client"}
                  </p>

                  <p className="text-gray-600 mt-0.5">
                    {slotDateFormat(item.slotDate)} • {item.slotTime || "N/A"}
                  </p>

                  <span className="inline-block mt-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 tracking-wide">
                    {mode}
                  </span>

                </div>

                {/* Status / Buttons */}
                <div className="flex items-center gap-4">

                  {item.cancelled ? (
                    <p className="text-red-500 font-semibold text-sm">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 font-semibold text-sm">Completed</p>
                  ) : (
                    <div className="flex items-center gap-4">

                      <FaTimesCircle
    onClick={() => cancelConsultation(item._id)}
    className="w-7 h-7 cursor-pointer text-red-500 hover:opacity-70 transition"
    title="Cancel Consultation"
/>

<FaCheckCircle
    onClick={() => completeConsultation(item._id)}
    className="w-7 h-7 cursor-pointer text-green-500 hover:opacity-70 transition"
    title="Mark as Complete"
/>


                    </div>
                  )}
                </div>

              </div>
            )
          })}

          {latestConsultations.length === 0 && (
            <p className="px-6 py-8 text-center text-gray-500">
              No recent consultations found.
            </p>
          )}

        </div>
      </div>
    </div>
  )
}

export default InfluencerDashboard
