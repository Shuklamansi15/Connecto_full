import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { AppContext } from '../contex/AppContext'
import ConfirmPopup from '../components/ConfirmPopup'

// Renamed component for influencer website context
const MyConsultations = () => {

    // Destructure context values (added currencySymbol for display)
    const { backendUrl, token, currencySymbol } = useContext(AppContext)
    const navigate = useNavigate()

    const [consultations, setConsultations] = useState([]) // Renamed appointments to consultations
    const [paymentId, setPaymentId] = useState('') // Renamed payment to paymentId for clarity

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        // Defensive check and handling for the date format
        if (!slotDate) return 'N/A'
        const dateArray = slotDate.split('_')
        // Array index 1 is the month number (1-based), so subtract 1 for the months array (0-based)
        const monthIndex = Number(dateArray[1]) - 1
        return dateArray[0] + " " + months[monthIndex] + " " + dateArray[2]
    }

    // Function to fetch User Consultations Data Using API
    const getUserConsultations = useCallback(async () => {
        if (!token) return navigate('/login'); // Redirect if no token

        try {
            // Updated API endpoint to reflect consultations instead of appointments
            const { data } = await axios.get(backendUrl + '/api/user/consultations', { headers: { token } })
            
            // Assuming the backend response structure has a 'consultations' key
            if (data.success && data.consultations) {
                setConsultations(data.consultations.reverse())
            } else {
                setConsultations([])
            }

        } catch (error) {
            console.error('Fetch error:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch consultations.')
        }
    }, [backendUrl, token, navigate])

    // Function to cancel consultation Using API
    const cancelConsultation = async (consultationId) => {
        try {
            // Updated API endpoint to reflect cancel-consultation
            const { data } = await axios.post(backendUrl + '/api/user/cancel-consultation', { consultationId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserConsultations() // Refresh list
            } else {
                toast.error(data.message)
            }    

        } catch (error) {
            console.error('Cancel error:', error)
            toast.error(error?.response?.data?.message || 'Cancellation failed.')
        }
    }

    // Razorpay Initialization (Logic remains the same, just updated names)
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
                    // Assuming verifyRazorpay endpoint handles consultation verification
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        toast.success('Payment successful!')
                        getUserConsultations() // Refresh list
                    }
                } catch (error) {
                    console.error('Razorpay verification error:', error)
                    toast.error(error?.response?.data?.message || 'Payment verification failed.')
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const consultationRazorpay = async (consultationId) => {
        try {
            // Assuming the payment endpoint handles consultation payments
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { consultationId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Razorpay init error:', error)
            toast.error(error?.response?.data?.message || 'Razorpay payment failed to initialize.')
        }
    }

    // Function to make payment using stripe
    const consultationStripe = async (consultationId) => {
        try {
            // Assuming the payment endpoint handles consultation payments
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { consultationId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Stripe init error:', error)
            toast.error(error?.response?.data?.message || 'Stripe payment failed to initialize.')
        }
    }


    useEffect(() => {
        if (token) {
            getUserConsultations()
        }
    }, [token, getUserConsultations]) // Added getUserConsultations to dependency array

    // Helper to format the consultation mode for display
    const getModeDisplay = (mode) => {
        switch (mode) {
            case 'chat': return { label: 'Priority Chat', class: 'bg-blue-100 text-blue-800' }
            case 'call': return { label: 'Phone Call', class: 'bg-yellow-100 text-yellow-800' }
            case 'video': return { label: 'Video Call', class: 'bg-purple-100 text-purple-800' }
            default: return { label: 'Unknown', class: 'bg-gray-100 text-gray-800' }
        }
    }


    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
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
                        // Use infData for consistency with booking logic
                        const infData = item.infData || {}
                        const modeDisplay = getModeDisplay(item.mode)

                        return (
                            <div key={item._id} className='flex flex-col sm:flex-row items-start sm:items-stretch gap-6 p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                                
                                {/* Influencer Image & Details */}
                                <div className='flex-shrink-0 w-full sm:w-48'>
                                    <img 
                                        className='w-full h-full object-cover rounded-lg aspect-[4/3] border border-gray-100' 
                                        src={infData.image || assets.placeholder_image} 
                                        alt={infData.name || 'Influencer'} 
                                    />
                                </div>
                                
                                {/* Consultation Info */}
                                <div className='flex-1 text-sm text-gray-600'>
                                    <p className='text-xl font-bold text-gray-900 mb-1'>{infData.name || 'Unknown Influencer'}</p>
                                    
                                    {/* Category (was Speciality) */}
                                    <p className='text-base font-medium text-[#1999d5] mb-2'>
                                        Category: {infData.category || 'General'}
                                    </p>

                                    {/* Consultation Mode */}
                                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${modeDisplay.class} mb-2`}>
                                        {modeDisplay.label}
                                    </span>
                                    
                                    {/* Date & Time */}
                                    <p className='mt-2'>
                                        <span className='text-sm text-gray-700 font-medium'>Date:</span> {slotDateFormat(item.slotDate)}
                                    </p>
                                    <p>
                                        <span className='text-sm text-gray-700 font-medium'>Time:</span> {item.slotTime}
                                    </p>

                                    {/* Fee */}
                                    <p className='mt-2 text-lg font-bold text-gray-800'>
                                        Fee: {currencySymbol}{Number(item.amount).toFixed(2) || 'N/A'}
                                    </p>
                                </div>
                                
                                {/* Actions & Status */}
                                <div className='flex flex-col gap-2 justify-start sm:justify-end text-sm w-full sm:w-auto sm:min-w-48'>
                                    
                                    {/* STATUS BUTTONS */}
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

                                    {/* PAYMENT BUTTONS */}
                                    {/* Not cancelled, Not paid, Not completed, and payment selection is NOT active */}
                                    {!item.cancelled && !item.payment && !item.isCompleted && paymentId !== item._id && (
                                        <button onClick={() => setPaymentId(item._id)} className='w-full text-white bg-[#1999d5] py-2 rounded font-semibold hover:bg-[#1579b4] transition-all duration-300'>
                                            Pay {currencySymbol}{Number(item.amount).toFixed(2) || 'N/A'}
                                        </button>
                                    )}
                                    
                                    {/* PAYMENT OPTIONS (when payment selection IS active) */}
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

                                    {/* PAID status */}
                                    {!item.cancelled && item.payment && !item.isCompleted && (
                                        <button className='w-full py-2 border border-blue-500 rounded text-blue-500 font-semibold bg-blue-50'>
                                            Paid
                                        </button>
                                    )}

                                    {/* CANCEL button */}
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