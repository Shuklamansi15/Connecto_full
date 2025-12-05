import React, { useEffect, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllConsultations = () => {

  const {
    aToken,
    consultations,
    cancelConsultation,
    getAllConsultations
  } = useContext(AdminContext);

  const {
    currency,
    calculateAge
  } = useContext(AppContext);

  // Fixed Date Formatter
  const slotDateFormat = (dateString) => {
    if (!dateString) return "Invalid Date";

    let date = new Date(dateString);

    // Manual parsing if Date fails
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-_/]/);
      if (parts.length === 3) {
        date = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    if (aToken) {
      getAllConsultations();
    }
  }, [aToken]);

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Consultations</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b'>
          <p>#</p>
          <p>User</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Influencer</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {(consultations || []).map((item, index) => {
          const user = item.userData || {};
          const influencer = item.infData || {};

          return (
            <div
              key={item._id || index}
              className='flex flex-wrap justify-between max-sm:gap-2 
                         sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                         items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
            >

              <p className='max-sm:hidden'>{index + 1}</p>

              {/* User */}
              <div className='flex items-center gap-2'>
                <img src={user.image} className='w-8 rounded-full' alt="" />
                <p>{user.name || "Unknown"}</p>
              </div>

              {/* Age */}
              <p className='max-sm:hidden'>
                {user.dob ? calculateAge(user.dob) : "N/A"}
              </p>

              {/* Date & Time */}
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

              {/* Influencer */}
              <div className='flex items-center gap-2'>
                <img src={influencer.image} className='w-8 h-8 rounded-full bg-gray-200' alt="" />
                <p>{influencer.name || "Unknown"}</p>
              </div>

              {/* Rate */}
              <p>{currency}{item.amount}</p>

              {/* Action */}
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium'>Completed</p>
              ) : (
                <img
                  onClick={() => cancelConsultation(item._id)}
                  className='w-10 cursor-pointer'
                  src={assets.cancel_icon}
                  alt="cancel"
                />
              )}
            </div>
          )
        })}

      </div>

    </div>
  )
}

export default AllConsultations
