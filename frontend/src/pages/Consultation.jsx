import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedInfluencers from '../components/RelatedInfluencers';
import qrChat from '../assets/qr-chat.jpg';
import qrCall from '../assets/qr-call.jpg';
import qrVideo from '../assets/qr-video.jpg';
import { AppContext } from '../contex/AppContext';
import {
  FaCommentDots,
  FaRegCalendarAlt,
  FaPhoneAlt,
  FaVideo,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";

// Theme colors
const PRIMARY_COLOR_CLASS = 'bg-[#1999d5]';
const PRIMARY_TEXT_CLASS = 'text-[#1999d5]';
const ACCENT_BG_CLASS = 'bg-[#1999d5]/10';
const SUCCESS_COLOR_CLASS = 'bg-[#1999d5]';

// Mode options
const modeOptions = [
  {
    value: 'chat',
    label: 'Chat',
    icon: <FaCommentDots className="text-xl text-[#1999d5]" />,
    description: 'Text-based consultation.',
  },
  {
    value: 'call',
    label: 'Phone Call',
    icon: <FaPhoneAlt className="text-xl text-[#1999d5]" />,
    description: 'Voice consultation.',
  },
  {
    value: 'video',
    label: 'Video Call',
    icon: <FaVideo className="text-xl text-[#1999d5]" />,
    description: 'Face-to-face video session.',
  },
];

const Consultation = () => {
  const { infId } = useParams();
  const navigate = useNavigate();

  const {
    Influencers: influencers = [],
    currencySymbol = '₹',
    backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
    token = '',
    userData: user = null,
    showNotification = () => {},
  } = useContext(AppContext) || {};

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // States
  const [infInfo, setInfInfo] = useState(null);
  const [infSlots, setInfSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [mode, setMode] = useState('chat');
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch influencer info
  const fetchInfInfo = useCallback(() => {
    if (!Array.isArray(influencers)) return;
    const found = influencers.find((inf) => String(inf._id) === String(infId));
    setInfInfo(found || null);
  }, [influencers, infId]);

  // Generate available slots
  const getAvailableSolts = useCallback(() => {
    setInfSlots([]);
    if (!infInfo) return;

    const slotsBooked = infInfo.slots_booked || {};
    const newSlots = [];

    for (let i = 0; i < 7; i++) {
      const today = new Date();
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const now = new Date();
        let startHour = now.getHours();
        let startMinutes = now.getMinutes() > 30 ? 0 : 30;
        if (now.getMinutes() > 30) startHour += 1;
        if (startHour < 10) {
          startHour = 10;
          startMinutes = 0;
        }
        currentDate.setHours(startHour, startMinutes, 0, 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      if (currentDate >= endTime) continue;

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const slotDateKey = `${day}_${month}_${year}`;
      const bookedTimesForDay = Array.isArray(slotsBooked[slotDateKey]) ? slotsBooked[slotDateKey] : [];

      const timeSlots = [];
      const iterDate = new Date(currentDate);

      while (iterDate < endTime) {
        const formattedTime = iterDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (!bookedTimesForDay.includes(formattedTime)) {
          timeSlots.push({
            datetime: new Date(iterDate),
            time: formattedTime,
          });
        }
        iterDate.setMinutes(iterDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) newSlots.push(timeSlots);
    }

    setInfSlots(newSlots);
    if (newSlots.length > 0) {
      setSlotIndex((prev) => Math.min(prev, newSlots.length - 1));
    }
  }, [infInfo]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSlotTime('');
    setSlotIndex(0);
  };

  const bookConsultation = () => {
    if (!token || !user?._id) {
      showNotification('Login to book consultation', 'warning');
      return navigate('/login');
    }

    const selectedDaySlots = infSlots[slotIndex];
    if (!Array.isArray(selectedDaySlots) || selectedDaySlots.length === 0 || !slotTime) {
      showNotification('Please select a valid date and time slot.', 'warning');
      return;
    }

    setShowPaymentCard(true);
  };

  // Effects
  useEffect(() => {
    if (Array.isArray(influencers) && influencers.length > 0) {
      fetchInfInfo();
    } else {
      setInfInfo(null);
    }
  }, [influencers, infId, fetchInfInfo]);

  useEffect(() => {
    if (infInfo) {
      getAvailableSolts();
    } else {
      setInfSlots([]);
      setSlotIndex(0);
      setSlotTime('');
    }
  }, [infInfo, getAvailableSolts]);

  useEffect(() => {
    const currentDaySlots = infSlots[slotIndex];
    if (Array.isArray(currentDaySlots) && currentDaySlots.length > 0) {
      const defaultTime = currentDaySlots.find((slot) => slot.time === slotTime)?.time || currentDaySlots[0].time;
      setSlotTime(defaultTime);
    } else {
      setSlotTime('');
    }
  }, [slotIndex, infSlots]);

  // Helpers
  const consultationFee = infInfo?.rates?.[mode];
  const consultationFeeDisplay =
    typeof consultationFee === 'number' || (!isNaN(Number(consultationFee)))
      ? Number(consultationFee).toFixed(2)
      : 'N/A';

  const isBookingReady = Boolean(slotTime) && consultationFeeDisplay !== 'N/A';

  const getDisplayDate = (datetime) => {
    const date = datetime.getDate();
    const month = datetime.toLocaleString('default', { month: 'short' });
    let suffix = 'th';
    if (date === 1 || date === 21 || date === 31) suffix = 'st';
    else if (date === 2 || date === 22) suffix = 'nd';
    else if (date === 3 || date === 23) suffix = 'rd';
    return `${date}${suffix} ${month}`;
  };

  if (!infInfo) {
    return <div className="text-center py-20 text-gray-500">Loading Influencer Details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Influencer Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 sticky top-6">
            <div className="relative mb-4">
              <img
                className="w-full aspect-square object-cover rounded-xl shadow-lg border-4 border-white"
                src={infInfo.image || assets.placeholder_image}
                alt={infInfo.name || 'Influencer'}
              />
            </div>
            <p className="flex items-center gap-2 text-3xl font-extrabold text-gray-800 mb-1">
              {infInfo.name} <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 mb-4">
              <p className={`font-bold ${PRIMARY_TEXT_CLASS} text-lg`}>{infInfo.category || '—'}</p>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-yellow-500">⭐</span>
                <p className="text-sm text-gray-700">Followers: {infInfo.followers ?? '—'}</p>
              </div>
            </div>
            <div className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
              <p className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2">
                About <img className="w-4" src={assets.info_icon} alt="Info" />
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{infInfo.about || 'No description provided.'}</p>
            </div>

            {/* Social Links */}
            {infInfo?.socialLinks && (
              <div className="mt-6">
                <p className="text-lg font-bold text-gray-700 mb-3">Follow on Social Media</p>
                <div className="flex items-center gap-4 text-2xl text-gray-600">
                  {infInfo.socialLinks.instagram && (
                    <a href={infInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-pink-500 transition-all">
                      <FaInstagram />
                    </a>
                  )}
                  {infInfo.socialLinks.youtube && (
                    <a href={infInfo.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-red-600 transition-all">
                      <FaYoutube />
                    </a>
                  )}
                  {infInfo.socialLinks.facebook && (
                    <a href={infInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-blue-600 transition-all">
                      <FaFacebook />
                    </a>
                  )}
                  {infInfo.socialLinks.twitter && (
                    <a href={infInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-blue-400 transition-all">
                      <FaTwitter />
                    </a>
                  )}
                  {infInfo.socialLinks.tiktok && (
                    <a href={infInfo.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-black transition-all">
                      <FaTiktok />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
              <FaRegCalendarAlt className="text-[#1999d5] text-2xl" />
              Book Your Consultation Session
            </h3>

            {/* 1. Mode Selection */}
            <div className="mb-8 border-b pb-6">
              <p className="text-xl font-extrabold text-gray-700 mb-4 flex items-center gap-2">
                <span className={`${PRIMARY_COLOR_CLASS} text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold`}>1</span>
                Choose Consultation Mode
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {modeOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleModeChange(option.value)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform ${
                      mode === option.value
                        ? `border-[#1999d5] ${ACCENT_BG_CLASS} shadow-lg scale-[1.02] ring-4 ring-[#1999d5]/30`
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <p className="text-2xl font-bold flex items-center gap-2 mb-1">
                      {option.icon} {option.label}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 h-10">{option.description}</p>
                    <p className="text-xl font-extrabold mt-3 text-gray-900">
                      {currencySymbol}{infInfo?.rates?.[option.value] ?? 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Date Selection */}
            <div className="mb-8 border-b pb-6">
              <p className="text-xl font-extrabold text-gray-700 mb-4 flex items-center gap-2">
                <span className={`${PRIMARY_COLOR_CLASS} text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold`}>2</span>
                Select Available Date
              </p>
              <div className="flex gap-4 items-center w-full overflow-x-scroll py-2">
                {Array.isArray(infSlots) && infSlots.length > 0 ? (
                  infSlots.map((daySlots, index) => {
                    if (!Array.isArray(daySlots) || daySlots.length === 0) return null;
                    const dateObj = daySlots[0].datetime;
                    const displayDate = getDisplayDate(dateObj);
                    return (
                      <div
                        onClick={() => {
                          setSlotIndex(index);
                          setSlotTime('');
                        }}
                        key={index}
                        className={`text-center py-4 px-4 min-w-[110px] rounded-xl cursor-pointer transition-all duration-300 flex-shrink-0 transform ${
                          slotIndex === index
                            ? `${PRIMARY_COLOR_CLASS} text-white shadow-lg scale-[1.08] ring-4 ring-[#1999d5]/30`
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                        }`}
                      >
                        <p className="text-base font-bold">{daysOfWeek[dateObj.getDay()]}</p>
                        <p className="text-lg font-extrabold">{dateObj.getDate()}</p>
                        <p className="text-sm font-medium">{displayDate.split(' ')[1]}</p>
                        <p className="text-xs font-medium mt-1 opacity-80">({daySlots.length} Slots)</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 italic p-2">No available slots in the next 7 days.</p>
                )}
              </div>
            </div>

            {/* 3. Time Slot Selection */}
            <div className="mb-8 border-b pb-6">
              <p className="text-xl font-extrabold text-gray-700 mb-4 flex items-center gap-2">
                <span className={`${PRIMARY_COLOR_CLASS} text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold`}>3</span>
                Select Time Slot (30 mins duration)
              </p>
              <div className="flex flex-wrap gap-3 w-full max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-xl bg-gray-50">
                {Array.isArray(infSlots[slotIndex]) && infSlots[slotIndex].length > 0 ? (
                  infSlots[slotIndex].map((slot, idx) => (
                    <p
                      key={idx}
                      onClick={() => setSlotTime(slot.time)}
                      className={`text-base font-medium flex-shrink-0 px-6 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                        slot.time === slotTime
                          ? `${SUCCESS_COLOR_CLASS} text-white shadow-md shadow-[#1999d5]/50 transform scale-105`
                          : 'text-gray-700 border border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {slot.time.toLowerCase()}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 italic p-2">No available time slots on this day. Please select another date.</p>
                )}
              </div>
            </div>

            {/* Payment Modal - NO UTR INPUT */}
            {showPaymentCard && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Complete Your Payment
                  </h3>
                  <p className="text-center text-gray-600 mb-8">
                    Scan the QR code below with any UPI app to pay instantly.
                  </p>

                  <div className="flex flex-col items-center mb-8">
                    <img
                      src={
                        mode === 'chat' ? qrChat :
                        mode === 'call' ? qrCall :
                        mode === 'video' ? qrVideo :
                        assets.qr_placeholder
                      }
                      alt="Payment QR Code"
                      className="w-72 h-72 object-contain rounded-xl shadow-2xl border-4 border-gray-100"
                    />

                    <div className="mt-6 text-center space-y-2">
                      <p className="text-2xl font-bold text-gray-800">
                        {currencySymbol}{infInfo?.rates?.[mode] || 'N/A'}
                      </p>
                      <p className="text-lg text-gray-600">
                        {modeOptions.find(opt => opt.value === mode)?.label} Consultation
                      </p>
                      <p className="text-sm text-gray-500">Ref: UB41200000</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => {
                        showNotification("Payment successful! Your booking is confirmed.", "success");
                        setShowPaymentCard(false);
                        // Later: Call backend API to create booking here
                      }}
                      className="w-full bg-[#1999d5] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#1579b4] transition shadow-lg"
                    >
                      I Have Paid
                    </button>

                    <button
                      onClick={() => setShowPaymentCard(false)}
                      className="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary & Book Button */}
            <div className="mt-8">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-300 mb-6">
                <p className="text-lg font-bold text-gray-800 mb-3">Booking Summary</p>
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <p className="text-gray-600">Consultation Type:</p>
                  <p className="font-semibold">{modeOptions.find(opt => opt.value === mode)?.label}</p>
                </div>
                <div className="flex justify-between items-center py-4">
                  <p className="text-xl font-bold text-gray-800 flex items-center gap-2">💰 Total Fee:</p>
                  <p className={`text-3xl font-extrabold ${consultationFeeDisplay === 'N/A' ? 'text-red-500' : PRIMARY_TEXT_CLASS}`}>
                    {currencySymbol}{consultationFeeDisplay}
                  </p>
                </div>
              </div>

              <button
                onClick={bookConsultation}
                disabled={!isBookingReady || isLoading}
                className={`w-full text-white text-lg font-bold py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isBookingReady && !isLoading
                    ? `${SUCCESS_COLOR_CLASS} hover:bg-[#1579b4] shadow-2xl hover:scale-[1.005]`
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : isBookingReady ? (
                  `Book & Pay ${currencySymbol}${consultationFeeDisplay}`
                ) : (
                  'Select Date & Time to Book'
                )}
              </button>
            </div>
          </div>

          {/* Related Influencers */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              More in {infInfo.category || 'Category'} 🌟
            </h3>
            {infInfo.category && <RelatedInfluencers category={infInfo.category} infId={infId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;