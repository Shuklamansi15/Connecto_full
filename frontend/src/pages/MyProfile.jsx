import React, { useContext, useState } from 'react'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../contex/AppContext'

// IMPORTED REACT ICONS
import { FaUserEdit, FaSave, FaUser, FaPhone, FaCalendarDay, FaVenusMars, FaEnvelope } from 'react-icons/fa';
import { IoIosCloudUpload } from 'react-icons/io';

const PRIMARY_COLOR = '#1999d5'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(null)

    // DESTRUCTURING UPDATED: Include showNotification
    const { token, backendUrl, userData, setUserData, loadUserProfileData, showNotification } = useContext(AppContext)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const updateUserProfileData = async () => {
        try {
            if (!userData.name || !userData.phone || !userData.gender || !userData.dob) {
                showNotification('Please fill in all required fields.', 'warning')
                return
            }

            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
                headers: { token }
            })

            if (data.success) {
                showNotification(data.message, 'success')
                await loadUserProfileData()
                setIsEdit(false)
                setImage(null)
            } else {
                showNotification(data.message, 'error')
            }
        } catch (error) {
            console.log(error)
            showNotification(error.message, 'error')
        }
    }

    if (!userData) return null

    return (
        <div className='flex justify-center py-10 px-4 min-h-screen bg-gray-50'>
            <div className='w-full max-w-2xl bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100'>

                {/* Header and Edit/Save Button */}
                <div className='flex justify-between items-center mb-8 border-b pb-4'>
                    <h2 className='text-3xl font-bold text-gray-800 flex items-center gap-2'>
                        <FaUser style={{ color: PRIMARY_COLOR }} /> My Profile
                    </h2>
                    {isEdit ? (
                        <button
                            onClick={updateUserProfileData}
                            className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all shadow-md text-white bg-green-600 hover:bg-green-700 hover:shadow-lg flex items-center gap-2`}
                        >
                            <FaSave className='text-lg' /> Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEdit(true)}
                            className={`border border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}] px-4 sm:px-6 py-2 rounded-full font-semibold transition-all hover:bg-[${PRIMARY_COLOR}] hover:text-white flex items-center gap-2`}
                        >
                            <FaUserEdit className='text-lg' /> Edit Profile
                        </button>
                    )}
                </div>
                
                {/* Profile Image & Name Section */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10'>
                    <div className='relative w-36 h-36 flex-shrink-0'>
                        {isEdit ? (
                            <label htmlFor='image' className='group block cursor-pointer'>
                                <img
                                    className={`w-full h-full object-cover rounded-full shadow-lg border-4 transition-all duration-300 ${image ? 'border-blue-300' : 'border-gray-200'} group-hover:opacity-70`}
                                    src={image ? URL.createObjectURL(image) : userData.image || assets.default_user}
                                    alt={userData?.name || 'User Avatar'}
                                />
                                {/* Changed upload icon to React Icon */}
                                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/40'>
                                    <IoIosCloudUpload className='text-white text-3xl' />
                                </div>
                                <input 
                                    onChange={(e) => setImage(e.target.files[0])} 
                                    type="file" 
                                    id="image" 
                                    hidden 
                                    accept='image/*'
                                />
                            </label>
                        ) : (
                            <img
                                className='w-full h-full object-cover rounded-full shadow-lg border-4 border-white'
                                src={userData.image || assets.default_user}
                                alt={userData?.name || 'User Avatar'}
                            />
                        )}
                    </div>
                    
                    <div className='flex flex-col justify-center mt-4 sm:mt-0 w-full'>
                        {isEdit ? (
                            <input
                                name="name"
                                className='w-full text-4xl font-extrabold text-gray-800 bg-gray-50 border-b-2 border-[${PRIMARY_COLOR}] p-1 focus:outline-none focus:border-blue-500 transition-colors'
                                type="text"
                                onChange={handleChange}
                                value={userData.name}
                                placeholder='Enter your name'
                            />
                        ) : (
                            <p className='font-extrabold text-4xl text-[#262626]'>{userData.name}</p>
                        )}
                        <p className='text-lg font-medium text-gray-500 mt-1 flex items-center gap-2'>
                           <FaEnvelope className='text-sm' /> {userData.email}
                        </p>
                    </div>
                </div>

                <hr className='my-8 border-gray-200' />
                
                {/* Contact Information */}
                <div className='mb-10'>
                    {/* Replaced text icon with React Icon */}
                    <h3 className='text-xl font-bold text-[${PRIMARY_COLOR}] mb-4 flex items-center gap-2'>
                        <FaPhone /> Contact Information
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 p-5 bg-gray-50 rounded-xl shadow-inner border border-gray-200'>
                        <p className='font-semibold text-gray-700 flex items-center gap-2'>
                            <FaEnvelope style={{ color: PRIMARY_COLOR }} /> Email Address:
                        </p>
                        <p className='text-blue-600 font-medium'>{userData.email}</p>

                        <p className='font-semibold text-gray-700 flex items-center gap-2'>
                            <FaPhone style={{ color: PRIMARY_COLOR }} /> Phone Number:
                        </p>
                        {isEdit ? (
                            <input
                                name="phone"
                                className='w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-1 focus:ring-[${PRIMARY_COLOR}] focus:border-[${PRIMARY_COLOR}]'
                                type="text"
                                onChange={handleChange}
                                value={userData.phone}
                                placeholder='(e.g., 9876543210)'
                            />
                        ) : (
                            <p className='text-gray-800 font-medium'>{userData.phone || 'Not provided'}</p>
                        )}
                    </div>
                </div>

                {/* Basic Information */}
                <div className='mb-10'>
                    {/* Replaced text icon with React Icon */}
                    <h3 className='text-xl font-bold text-[${PRIMARY_COLOR}] mb-4 flex items-center gap-2'>
                        <FaCalendarDay /> Basic Information
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 p-5 bg-gray-50 rounded-xl shadow-inner border border-gray-200'>
                        <p className='font-semibold text-gray-700 flex items-center gap-2'>
                            <FaVenusMars style={{ color: PRIMARY_COLOR }} /> Gender:
                        </p>
                        {isEdit ? (
                            <select
                                name="gender"
                                className='w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-1 focus:ring-[${PRIMARY_COLOR}] focus:border-[${PRIMARY_COLOR}]'
                                onChange={handleChange}
                                value={userData.gender}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p className='text-gray-800 font-medium'>{userData.gender || 'Not provided'}</p>
                        )}

                        <p className='font-semibold text-gray-700 flex items-center gap-2'>
                            <FaCalendarDay style={{ color: PRIMARY_COLOR }} /> Date of Birth:
                        </p>
                        {isEdit ? (
                            <input
                                name="dob"
                                className='w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-1 focus:ring-[${PRIMARY_COLOR}] focus:border-[${PRIMARY_COLOR}]'
                                type='date'
                                onChange={handleChange}
                                value={userData.dob}
                            />
                        ) : (
                            <p className='text-gray-800 font-medium'>{userData.dob || 'Not provided'}</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MyProfile