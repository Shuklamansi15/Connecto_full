import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();

    const { aToken, getDashData, cancelConsultation, dashData } = useContext(AdminContext)
    const { slotDateFormat, currency, calculateAge } = useContext(AppContext)

    useEffect(() => {
        if (aToken) {
            getDashData()
        }
    }, [aToken])

    // Prevent crashing before data loads
    if (!dashData || !dashData.latestConsultations) {
        return <div className="p-5 text-center text-lg text-gray-500">Loading Dashboard Data...</div>;
    }

    const latestConsultations = Array.isArray(dashData.latestConsultations)
        ? dashData.latestConsultations
        : [];

    return (
        <div className='m-5'>

            {/* ==== TOP CARDS ==== */}
            <div className='flex flex-wrap gap-3'>

                {/* Influencers */}
                <div
                    onClick={() => navigate('/admin/influencers-stats')}

                    className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'
                >
                    <img className='w-14' src={assets.doctor_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.influencers}</p>
                        <p className='text-gray-400'>Influencers</p>
                    </div>
                </div>

                {/* Consultations */}
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.consultations}</p>
                        <p className='text-gray-400'>Consultations</p>
                    </div>
                </div>

                {/* Users */}
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
                        <p className='text-gray-400'>Users</p>
                    </div>
                </div>

            </div>

            {/* ==== LATEST CONSULTATIONS ==== */}
            <div className='bg-white mt-10 rounded-b'>

                <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-semibold'>Latest Consultations</p>
                </div>

                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b text-sm font-medium text-gray-700'>
                    <p>#</p>
                    <p>User</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Influencer</p>
                    <p>Fee</p>
                    <p>Action</p>
                </div>

                <div className='pt-4 border border-t-0 text-sm max-h-[400px] overflow-y-auto'>

                    {latestConsultations.slice(0, 5).map((item, index) => {

                        const influencer = item.infData || {};
                        const user = item.userData || {};

                        const influencerName = influencer.name || "Unknown Influencer";
                        const influencerImage = influencer.image || assets.default_user;
                        const userName = user.name || "Unknown User";
                        const userImage = user.image || assets.default_user;
                        const formattedDate = item.slotDate ? slotDateFormat(item.slotDate) : "Unknown Date";

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
                                    <img src={userImage} className='w-8 rounded-full' alt="" />
                                    <p>{userName}</p>
                                </div>

                                {/* Age */}
                                <p className='max-sm:hidden'>
                                    {user.dob ? calculateAge(user.dob) : "N/A"}
                                </p>

                                {/* Date & Time */}
                                <p>{formattedDate}, {item.slotTime}</p>

                                {/* Influencer */}
                                <div className='flex items-center gap-2'>
                                    <img src={influencerImage} className='w-8 h-8 rounded-full bg-gray-200 object-cover' alt="" />
                                    <p>{influencerName}</p>
                                </div>

                                {/* Fee */}
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
                        );
                    })}

                    {latestConsultations.length === 0 && (
                        <p className="px-6 py-3 text-center text-gray-500">
                            No recent consultations found.
                        </p>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
