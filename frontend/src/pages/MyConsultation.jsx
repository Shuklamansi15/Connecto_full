import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../contex/AppContext'
import ConfirmPopup from '../components/ConfirmPopup'
import NotificationCard from '../components/NotificationCard'

// Renamed component for influencer website context
const MyConsultations = () => {

    const { backendUrl, token, currencySymbol } = useContext(AppContext)
    const navigate = useNavigate()

    const [consultations, setConsultations] = useState([])
    const [paymentId, setPaymentId] = useState('')

    // ⭐ NEW — Notification State (Replacement of Toast)
    const [notification, setNotification] = useState({
        show: false,
        type: 'success',
        message: '',
    })

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return 'N/A'
        const dateArray = slotDate.split('_')
        const monthIndex = Number(dateArray[1]) - 1
        return dateArray[0] + " " + months[monthIndex] + " " + dateArray[2]
    }

    const getUserConsultations = useCallback(async () => {
        if (!token) return navigate('/login');

        try {
            const { data } = await axios.get(backendUrl + '/api/user/consultations', { headers: { token } })
            if (data.success && data.consultations) {
                setConsultations(data.consultations.reverse())
            } else {
                setConsultations([])
            }

        } catch (error) {
            console.error('Fetch error:', error)
            setNotification({ show: true, type: 'error', message: error?.response?.data?.message || 'Failed to fetch consultations.' })
        }
    }, [backendUrl, token, navigate])

    const cancelConsultation = async (consultationId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-consultation', { consultationId }, { headers: { token } })

            if (data.success) {
                setNotification({ show: true, type: 'success', message: data.message })
                getUserConsultations()
            } else {
                setNotification({ show: true, type: 'error', message: data.message })
            }    

        } catch (error) {
            console.error('Cancel error:', error)
            setNotification({ show: true, type: 'error', message: error?.response?.data?.message || 'Cancellation failed.' })
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Consultation Payment',
            description: "Influencer Consultation Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        setNotification({ show: true, type: 'success', message: 'Payment successful!' })
                        getUserConsultations()
                    }
                } catch (error) {
                    console.error('Razorpay verification error:', error)
                    setNotification({ show: true, type: 'error', message: error?.response?.data?.message || 'Payment verification failed.' })
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const consultationRazorpay = async (consultationId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { consultationId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                setNotification({ show: true, type: 'error', message: data.message })
            }
        } catch (error) {
            console.error('Razorpay init error:', error)
            setNotification({ show: true, type: 'error', message: error?.response?.data?.message || 'Razorpay payment failed to initialize.' })
        }
    }

    const consultationStripe = async (consultationId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { consultationId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                setNotification({ show: true, type: 'error', message: data.message })
            }
        } catch (error) {
            console.error('Stripe init error:', error)
            setNotification({ show: true, type: 'error', message: error?.response?.data?.message || 'Stripe payment failed to initialize.' })
        }
    }

    useEffect(() => {
        if (token) {
            getUserConsultations()
        }
    }, [token, getUserConsultations])

    const getModeDisplay = (mode) => {
        switch (mode) {
            case 'chat': return { label: 'Chat', class: 'bg-blue-100 text-blue-800' }
            case 'call': return { label: 'Phone Call', class: 'bg-yellow-100 text-yellow-800' }
            case 'video': return { label: 'Video Call', class: 'bg-purple-100 text-purple-800' }
            default: return { label: 'Unknown', class: 'bg-gray-100 text-gray-800' }
        }
    }

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>

            {/* ⭐ Notification Card */}
            {notification.show && (
                <NotificationCard
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification({ show: false, type: 'success', message: '' })}
                />
            )}

            <p className='pb-4 text-2xl font-bold text-gray-800 border-b border-gray-200'>
                My Consultations 💬
            </p>
            <div className='mt-6 space-y-4'>
                {consultations.length === 0 ? (
                    <p className='text-center py-10 text-gray-500 text-lg'>
                        You haven't booked any consultations yet.
                    </p>
                ) : (
                    consultations.map((item) => {
                        const infData = item.infData || {}
                        const modeDisplay = getModeDisplay(item.mode)

                        return (
                            <div key={item._id} className='flex flex-col sm:flex-row items-start sm:items-stretch gap-6 p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                                
                                <div className='flex-shrink-0 w-full sm:w-48'>
                                    <img 
                                        className='w-full h-full object-cover rounded-lg aspect-[4/3] border border-gray-100' 
                                        src={infData.image || assets.placeholder_image} 
                                        alt={infData.name || 'Influencer'} 
                                    />
                                </div>
                                
                                <div className='flex-1 text-sm text-gray-600'>
                                    <p className='text-xl font-bold text-gray-900 mb-1'>{infData.name || 'Unknown Influencer'}</p>
                                    <p className='text-base font-medium text-[#1999d5] mb-2'>
                                        Category: {infData.category || 'General'}
                                    </p>
                                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${modeDisplay.class} mb-2`}>
                                        {modeDisplay.label}
                                    </span>
                                    <p className='mt-2'>
                                        <span className='text-sm text-gray-700 font-medium'>Date:</span> {slotDateFormat(item.slotDate)}
                                    </p>
                                    <p>
                                        <span className='text-sm text-gray-700 font-medium'>Time:</span> {item.slotTime}
                                    </p>
                                    <p className='mt-2 text-lg font-bold text-gray-800'>
                                        Fee: {currencySymbol}{Number(item.amount).toFixed(2) || 'N/A'}
                                    </p>
                                </div>
                                
                                <div className='flex flex-col gap-2 justify-start sm:justify-end text-sm w-full sm:w-auto sm:min-w-48'>
                                    
                                    {item.cancelled && !item.isCompleted && (
                                        <button className='w-full py-2 border border-red-500 rounded text-red-500 font-semibold bg-red-50'>
                                            Appointment Cancelled 🚫
                                        </button>
                                    )}
                                    {item.isCompleted && (
                                        <button className='w-full py-2 border border-green-500 rounded text-green-500 font-semibold bg-green-50'>
                                            Completed 🎉
                                        </button>
                                    )}
                                    {!item.cancelled && !item.payment && !item.isCompleted && paymentId !== item._id && (
                                        <button onClick={() => setPaymentId(item._id)} className='w-full text-white bg-[#1999d5] py-2 rounded font-semibold hover:bg-[#1579b4] transition-all duration-300'>
                                            Pay {currencySymbol}{Number(item.amount).toFixed(2) || 'N/A'}
                                        </button>
                                    )}
                                    {!item.cancelled && !item.payment && !item.isCompleted && paymentId === item._id && (
                                        <>
                                            <button onClick={() => consultationStripe(item._id)} className='w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2'>
                                                <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="Stripe" />
                                            </button>
                                            <button onClick={() => consultationRazorpay(item._id)} className='w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2'>
                                                <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="Razorpay" />
                                            </button>
                                            <button onClick={() => setPaymentId('')} className='w-full text-sm text-gray-500 hover:underline'>
                                                Cancel Payment Selection
                                            </button>
                                        </>
                                    )}
                                    {!item.cancelled && item.payment && !item.isCompleted && (
                                        <button className='w-full py-2 border border-blue-500 rounded text-blue-500 font-semibold bg-blue-50'>
                                            Paid
                                        </button>
                                    )}
                                   {!item.cancelled && !item.isCompleted && (
                                        <button
                                            onClick={() => ConfirmPopup(item._id, cancelConsultation)}
                                            className='w-full text-gray-600 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 mt-2'
                                        >
                                            Cancel Consultation
                                        </button>
                                    )}

                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default MyConsultations
