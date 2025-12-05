import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedInfluencers from '../components/RelatedInfluencers' // Assuming you renamed the component
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../contex/AppContext'

// Define primary colors for a cleaner look
const PRIMARY_COLOR_CLASS = 'bg-[#1999d5]' // Primary Blue
const PRIMARY_TEXT_CLASS = 'text-[#1999d5]'
const ACCENT_BG_CLASS = 'bg-[#1999d5]/10' // Light Blue Background
// Set SUCCESS_COLOR_CLASS to the primary theme color for consistency
const SUCCESS_COLOR_CLASS = 'bg-[#1999d5]' 

// Enhanced Mode Options for better visual selection
const modeOptions = [
    { value: 'chat', label: 'Priority Chat', icon: '💬', description: 'Text-based consultation.' },
    { value: 'call', label: 'Phone Call', icon: '📞', description: 'Voice consultation.' },
    { value: 'video', label: 'Video Call', icon: '📹', description: 'Face-to-face video session.' },
];

const Consultation = () => {
    const { infId } = useParams()
    // Defensive object destructuring from context
    const ctx = useContext(AppContext) || {}
    const influencers = ctx.influencers || ctx.Influencers || []
    const currencySymbol = ctx.currencySymbol || '₹'
    const backendUrl = ctx.backendUrl || (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000")
    const token = ctx.token || ''
    const getInfluencersData = ctx.getInfluencersData || (() => {})
    const user = ctx.user || ctx.userData || null

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [infInfo, setInfInfo] = useState(null)
    const [infSlots, setInfSlots] = useState([]) // array of arrays: [[slot,...], [slot,...], ...]
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [mode, setMode] = useState('chat') // default mode
    const [isLoading, setIsLoading] = useState(false) // loading state

    const navigate = useNavigate()

    // Find and set influencer info from influencers list
    const fetchInfInfo = useCallback(() => {
        if (!Array.isArray(influencers)) return
        const found = influencers.find((inf) => String(inf._id) === String(infId))
        setInfInfo(found || null)
    }, [influencers, infId])

    // Build available slots for next 7 days
    const getAvailableSolts = useCallback(() => {
        setInfSlots([])

        if (!infInfo) return

        const slotsBooked = infInfo.slots_booked || {}
        const newSlots = []

        for (let i = 0; i < 7; i++) {
            const today = new Date(); 
            
            // compute the date for day i
            const currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // end time = 21:00 on that day
            const endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0)

            // Calculate start time based on the day
            if (i === 0) {
                // For today, calculate the next 30-minute slot, but not before 10:00 AM
                const now = new Date()
                let startMinutes = now.getMinutes()
                let startHour = now.getHours()

                // If minutes are > 30, start at (hour+1):00. If <= 30, start at hour:30.
                if (startMinutes > 30) {
                    startHour += 1
                    startMinutes = 0
                } else {
                    startMinutes = 30
                }
                
                // Ensure the start time is at least 10:00 AM
                if (startHour < 10) {
                    startHour = 10
                    startMinutes = 0
                }

                currentDate.setHours(startHour, startMinutes, 0, 0)
            } else {
                // For future days, start at 10:00 AM
                currentDate.setHours(10, 0, 0, 0)
            }

            // Check if start time is before the end time
            if (currentDate >= endTime) continue

            const day = currentDate.getDate()
            const month = currentDate.getMonth() + 1
            const year = currentDate.getFullYear()
            const slotDateKey = `${day}_${month}_${year}`

            const bookedTimesForDay = Array.isArray(slotsBooked[slotDateKey]) ? slotsBooked[slotDateKey] : []

            const timeSlots = []
            const iterDate = new Date(currentDate)

            // iterate in 30-min increments until endTime
            while (iterDate < endTime) {
                const formattedTime = iterDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                
                // Check if slot is booked
                const isBooked = bookedTimesForDay.includes(formattedTime)
                if (!isBooked) {
                    timeSlots.push({
                        datetime: new Date(iterDate),
                        time: formattedTime
                    })
                }
                iterDate.setMinutes(iterDate.getMinutes() + 30)
            }

            // push only non-empty day entries
            if (Array.isArray(timeSlots) && timeSlots.length > 0) {
                newSlots.push(timeSlots)
            }
        }

        setInfSlots(newSlots)

        // Reset index and set default time safely
        if (newSlots.length === 0) {
            setSlotIndex(0)
        } else {
            setSlotIndex(prev => Math.min(prev, newSlots.length - 1))
        }
    }, [infInfo])

    const handleModeChange = (newMode) => {
        setMode(newMode)
        // Reset time/index to force re-selection of the day/time after mode change
        setSlotTime('')
        setSlotIndex(0)
    }

    const bookConsultation = async () => {

        if (!token || !user?._id) {
            toast.warning('Login to book consultation')
            return navigate('/login')
        }

        const selectedDaySlots = infSlots[slotIndex]
        if (!Array.isArray(selectedDaySlots) || selectedDaySlots.length === 0 || !slotTime) {
            toast.warning('Please select a valid date and time slot.')
            return
        }

        const amount = infInfo?.rates?.[mode]
        const amountValid = (typeof amount === 'number') || (typeof amount === 'string' && !isNaN(Number(amount)))

        if (!amountValid) {
            toast.error(`Consultation rate for ${mode} mode is missing or invalid. Cannot book.`)
            return
        }

        const dateObj = selectedDaySlots.find(slot => slot.time === slotTime)?.datetime
        if (!dateObj) {
            toast.error('Invalid slot selected.')
            return
        }

        const day = dateObj.getDate()
        const month = dateObj.getMonth() + 1
        const year = dateObj.getFullYear()
        const slotDate = `${day}_${month}_${year}`

        const userDataPayload = {
            name: user?.name || '',
            email: user?.email || '',
            image: user?.image || ''
        }

        const infDataPayload = {
            name: infInfo?.name || '',
            email: infInfo?.email || '',
            image: infInfo?.image || '',
            category: infInfo?.category || '',
            rates: infInfo?.rates || {}
        }

        try {
            setIsLoading(true)

            const payload = {
                userId: user._id,
                infId: infInfo._id,
                slotDate,
                slotTime,
                userData: userDataPayload,
                infData: infDataPayload,
                amount: amount,
                mode,
                date: Date.now()
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/book-consultation',
                payload,
                { headers: { token } }
            )

            if (data?.success) {
                toast.success(data.message || 'Consultation booked!')
                getInfluencersData && getInfluencersData()
                navigate('/my-consultations')
            } else {
                toast.error(data?.message || 'Could not book consultation.')
            }

        } catch (error) {
            console.error('Booking error:', error)
            toast.error(error?.response?.data?.message || error?.message || 'Booking failed.')
        } finally {
            setIsLoading(false)
        }
    }

    // Effect to find influencer info when context changes or infId changes
    useEffect(() => {
        if (Array.isArray(influencers) && influencers.length > 0) {
            fetchInfInfo()
        } else {
            setInfInfo(null)
        }
    }, [influencers, infId, fetchInfInfo])

    // Effect to generate slots when infInfo changes
    useEffect(() => {
        if (infInfo) {
            getAvailableSolts()
        } else {
            setInfSlots([])
            setSlotIndex(0)
            setSlotTime('')
        }
    }, [infInfo, getAvailableSolts])

    // Effect to set default slotTime when slotIndex or infSlots change
    useEffect(() => {
        const currentDaySlots = infSlots[slotIndex]
        if (Array.isArray(currentDaySlots) && currentDaySlots.length > 0) {
            const defaultTime = currentDaySlots.find(slot => slot.time === slotTime)?.time || currentDaySlots[0].time
            setSlotTime(defaultTime)
        } else {
            setSlotTime('')
        }
    }, [slotIndex, infSlots, slotTime])

    // Safety check for rates access and booking status
    const consultationFee = infInfo?.rates?.[mode]
    const consultationFeeDisplay = (typeof consultationFee === 'number' || (typeof consultationFee === 'string' && !isNaN(Number(consultationFee))))
        ? Number(consultationFee).toFixed(2)
        : 'N/A'
    const isBookingReady = Boolean(slotTime) && consultationFeeDisplay !== 'N/A'

    // Function to format date text (with ordinal suffix)
    const getDisplayDate = (datetime) => {
        const date = datetime.getDate()
        const month = datetime.toLocaleString('default', { month: 'short' })
        
        let suffix = 'th'
        if (date === 1 || date === 21 || date === 31) suffix = 'st'
        else if (date === 2 || date === 22) suffix = 'nd'
        else if (date === 3 || date === 23) suffix = 'rd'

        return `${date}${suffix} ${month}`
    }

    if (!infInfo) return <div className='text-center py-20 text-gray-500'>Loading Influencer Details...</div>

    return (
        <div className='max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* ---------- Influencer Sidebar (Sticky) ----------- */}
                <div className='lg:col-span-1'>
                    <div className='bg-white p-6 rounded-2xl shadow-xl border border-gray-200 sticky top-6'>
                        <div className='relative mb-4'>
                            <img
                                className='w-full aspect-square object-cover rounded-xl shadow-lg border-4 border-white'
                                src={infInfo.image || assets.placeholder_image}
                                alt={infInfo.name || 'Influencer'}
                            />
                        </div>

                        <p className='flex items-center gap-2 text-3xl font-extrabold text-gray-800 mb-1'>
                            {infInfo.name} <img className='w-5' src={assets.verified_icon} alt="Verified" />
                        </p>
                        <div className='flex flex-wrap items-center gap-4 text-base text-gray-600 mb-4'>
                            <p className={`font-bold ${PRIMARY_TEXT_CLASS} text-lg`}>{infInfo.category || '—'}</p>
                            <div className='flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full'>
                                <span className='text-yellow-500'>⭐</span>
                                <p className='text-sm text-gray-700'>Followers: {infInfo.followers ?? '—'}</p>
                            </div>
                        </div>

                        <div className='mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50'>
                            <p className='flex items-center gap-2 text-lg font-bold text-gray-700 mb-2'>
                                About <img className='w-4' src={assets.info_icon} alt="Info" />
                            </p>
                            <p className='text-sm text-gray-600 leading-relaxed'>{infInfo.about || 'No description provided.'}</p>
                        </div>
                    </div>
                </div>

                {/* ---------- Booking Process Steps ---------- */}
                <div className='lg:col-span-2'>
                    <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-200'>
                        <h3 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-3'>Book Your Consultation Session 📅</h3>

                        {/* 1. Mode Selection */}
                        <div className='mb-8 border-b pb-6'>
                            <p className='text-xl font-extrabold text-gray-700 mb-4 flex items-center gap-2'>
                                <span className={`${PRIMARY_COLOR_CLASS} text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold`}>1</span>
                                Choose Consultation Mode
                            </p>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                {modeOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleModeChange(option.value)}
                                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform ${
                                            mode === option.value
                                                ? `border-[#1999d5] ${ACCENT_BG_CLASS} shadow-lg scale-[1.02] ring-4 ring-[#1999d5]/30` // Themed active state
                                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md'
                                        }`}
                                    >
                                        <p className='text-2xl font-bold flex items-center gap-2 mb-1'>
                                            {option.icon} {option.label}
                                        </p>
                                        <p className='text-sm text-gray-600 line-clamp-2 h-10'>{option.description}</p>
                                        <p className='text-xl font-extrabold mt-3 text-gray-900'>
                                            {currencySymbol}{infInfo?.rates?.[option.value] ?? 'N/A'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Date Selection */}
                        <div className='mb-8 border-b pb-6'>
                            <p className='text-xl font-extrabold text-gray-700 mb-4 flex items-center gap-2'>
                                <span className={`${PRIMARY_COLOR_CLASS} text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold`}>2</span>
                                Select Available Date
                            </p>
                            <div className='flex gap-4 items-center w-full overflow-x-scroll py-2'>
                                {Array.isArray(infSlots) && infSlots.length > 0 ? (
                                    infSlots
                                        .map((daySlots, index) => {
                                            if (!Array.isArray(daySlots) || daySlots.length === 0) return null

                                            const dateObj = daySlots[0].datetime
                                            const displayDate = getDisplayDate(dateObj)

                                            return (
                                                <div
                                                    onClick={() => {
                                                        setSlotIndex(index)
                                                        setSlotTime('') // Clear time on new day selection
                                                    }}
                                                    key={index}
                                                    className={`text-center py-4 px-4 min-w-[110px] rounded-xl cursor-pointer transition-all duration-300 flex-shrink-0 transform ${
                                                        slotIndex === index
                                                            ? `${PRIMARY_COLOR_CLASS} text-white shadow-lg scale-[1.08] ring-4 ring-[#1999d5]/30` // Themed active state
                                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                                                    }`}
                                                >
                                                    <p className='text-base font-bold'>{daysOfWeek[dateObj.getDay()]}</p>
                                                    <p className='text-lg font-extrabold'>{dateObj.getDate()}</p>
                                                    <p className='text-sm font-medium'>{displayDate.split(' ')[1]}</p>
                                                    <p className='text-xs font-medium mt-1 opacity-80'>({daySlots.length} Slots)</p>
                                                </div>
                                            )
                                        })
                                ) : (
                                    <p className='text-gray-500 italic p-2'>No available slots in the next 7 days.</p>
                                )}
                            </div>
                        </div>

                        {/* 3. Time Slot Selection */}
                        <div className='mb-8 border-b pb-6'>
                            <p className='text-xl font-extrabold text-gray-700 mb-4 flex items-center gap-2'>
                                <span className={`${PRIMARY_COLOR_CLASS} text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold`}>3</span>
                                Select Time Slot (30 mins duration)
                            </p>
                            <div className='flex flex-wrap gap-3 w-full max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-xl bg-gray-50'>
                                {Array.isArray(infSlots[slotIndex]) && infSlots[slotIndex].length > 0 ? (
                                    infSlots[slotIndex].map((slot, index) => (
                                        <p
                                            onClick={() => setSlotTime(slot.time)}
                                            key={index}
                                            className={`text-base font-medium flex-shrink-0 px-6 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                                                slot.time === slotTime
                                                    ? `${SUCCESS_COLOR_CLASS} text-white shadow-md shadow-[#1999d5]/50 transform scale-105` // Themed active state
                                                    : 'text-gray-700 border border-blue-300 hover:bg-blue-50'
                                            }`}
                                        >
                                            {slot.time.toLowerCase()}
                                        </p>
                                    ))
                                ) : (
                                    <p className='text-gray-500 italic p-2'>No available time slots on this day. Please select another date.</p>
                                )}
                            </div>
                        </div>

                        {/* Summary and Booking Button */}
                        <div className='mt-8'>
                            {/* Summary Box now uses the blue theme */}
                            <div className='p-5 bg-blue-50 rounded-xl border border-blue-300 mb-6'>
                                <p className='text-lg font-bold text-gray-800 mb-2'>Booking Summary</p>
                                <div className='flex justify-between items-center py-2 border-b border-blue-200'>
                                    <p className='text-base text-gray-600'>Consultation Type:</p>
                                    <p className='text-base font-semibold text-gray-800'>{modeOptions.find(opt => opt.value === mode)?.label}</p>
                                </div>
                                <div className='flex justify-between items-center py-2'>
                                    <p className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                                        💰 Total Fee:
                                    </p>
                                    <p className={`text-3xl font-extrabold ${consultationFeeDisplay === 'N/A' ? 'text-red-500' : PRIMARY_TEXT_CLASS}`}>
                                        {currencySymbol}{consultationFeeDisplay}
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                onClick={bookConsultation}
                                disabled={!isBookingReady || isLoading}
                                className={`w-full text-white text-lg font-bold px-20 py-4 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-2 ${
                                    isBookingReady && !isLoading
                                        ? `${SUCCESS_COLOR_CLASS} hover:bg-[#1579b4] shadow-xl shadow-[#1999d5]/50 hover:scale-[1.005]` // Themed CTA
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    isBookingReady ? `Book & Pay ${currencySymbol}${consultationFeeDisplay}` : 'Select Date & Time to Book'
                                )}
                            </button>
                        </div>
                    </div>

                   {/* Related Influencers */}
<div className='mt-10'>
    <h3 className='text-2xl font-bold text-gray-800 mb-4'>More in {infInfo.category || 'Category'} 🌟</h3>

    {/* FIX → pass correct prop name */}
    {infInfo.category && (
        <RelatedInfluencers category={infInfo.category} infId={infId} />
    )}
</div>

                </div>
            </div>
        </div>
    )
}

export default Consultation