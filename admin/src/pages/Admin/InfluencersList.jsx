import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import NotificationCard from '../../components/NotificationCard'; 
import {
    FaEdit, FaSave, FaTimes, FaToggleOn, FaToggleOff, FaUserTag,
    FaComment, FaPhoneAlt, FaVideo, FaInstagram, FaYoutube,
    FaFacebook, FaTwitter, FaTiktok
} from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';

const PRIMARY_COLOR = '#1999d5';
const SECONDARY_COLOR = '#C9D8FF';

const rateIconMap = {
    chat: FaComment,
    call: FaPhoneAlt,
    video: FaVideo,
};

const socialIconMap = {
    instagram: FaInstagram,
    youtube: FaYoutube,
    facebook: FaFacebook,
    twitter: FaTwitter,
    tiktok: FaTiktok,
};

const InfluencersList = () => {
    const { influencers, getAllInfluencers, changeAvailability, updateInfluencerData, aToken } =
        useContext(AdminContext);

    const { currency } = useContext(AppContext);

    const [editingId, setEditingId] = useState(null);
    const [editRates, setEditRates] = useState({ chat: '', call: '', video: '' });
    const [editSocialLinks, setEditSocialLinks] = useState({
        instagram: '',
        youtube: '',
        facebook: '',
        twitter: '',
        tiktok: '',
    });

    // ✅ Notification State
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 2500);
    };

    useEffect(() => {
        if (aToken) getAllInfluencers();
    }, [aToken]);

    const startEdit = (inf) => {
        setEditingId(inf._id);
        setEditRates({
            chat: inf.rates?.chat || '',
            call: inf.rates?.call || '',
            video: inf.rates?.video || '',
        });
        setEditSocialLinks(inf.socialLinks || {});
    };

    const saveEdit = async () => {
        if (!editingId) return;

        try {
            const ratesToSend = {
                chat: Number(editRates.chat) || 0,
                call: Number(editRates.call) || 0,
                video: Number(editRates.video) || 0,
            };

            await updateInfluencerData(editingId, ratesToSend, [], editSocialLinks);

            // 🔥 REPLACED toast.success
            showNotification("Influencer updated successfully!", "success");

            setEditingId(null);
        } catch (err) {
            // 🔥 REPLACED toast.error
            showNotification("Failed to update influencer", "error");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">

            {/* 🔔 Notification Card */}
            {notification.show && (
                <NotificationCard
                    message={notification.message}
                    type={notification.type}
                />
            )}

            <h1
                className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2 flex items-center"
                style={{ color: PRIMARY_COLOR }}
            >
                <MdOutlineDashboard className="mr-3 text-4xl" /> Influencer List

                {currency && (
                    <span className="text-base font-medium ml-4 p-1 px-3 rounded-lg bg-gray-200 text-gray-700">
                        ({currency})
                    </span>
                )}
            </h1>

            <div className="w-full flex flex-wrap gap-6 pt-2">
                {influencers.map((inf) => (
                    <div
                        key={inf._id}
                        className="bg-white border rounded-xl shadow-lg hover:shadow-xl w-full sm:w-64 overflow-hidden relative"
                        style={{ borderColor: SECONDARY_COLOR }}
                    >
                        <div className="p-4">
                            <div
                                className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                    inf.available
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {inf.available ? 'Available' : 'Unavailable'}
                            </div>

                            <img
                                className="w-full h-60 object-cover rounded-lg mb-4"
                                src={inf.image}
                                alt={inf.name}
                            />

                            <p className="text-xl font-bold text-gray-900">{inf.name}</p>
                            <p className="text-sm text-gray-600 flex items-center mb-3">
                                <FaUserTag className="mr-1" color={PRIMARY_COLOR} />
                                {inf.category}
                            </p>

                            <div
                                className="flex justify-between items-center p-2 rounded-lg"
                                style={{ backgroundColor: SECONDARY_COLOR }}
                            >
                                <p className="font-semibold text-sm">Live Status:</p>
                                <button onClick={() => changeAvailability(inf._id)}>
                                    {inf.available ? (
                                        <FaToggleOn className="text-3xl text-green-500" />
                                    ) : (
                                        <FaToggleOff className="text-3xl text-gray-500" />
                                    )}
                                </button>
                            </div>

                            {editingId !== inf._id && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-bold mb-2 text-gray-700">
                                        Current Rates
                                    </p>

                                    {Object.entries(inf.rates || {}).map(([key, value]) => {
                                        if (!value) return null;
                                        const Icon = rateIconMap[key];

                                        return (
                                            <div
                                                key={key}
                                                className="flex justify-between text-sm text-gray-600 py-0.5"
                                            >
                                                <span className="flex items-center gap-1 capitalize">
                                                    <Icon size={12} color={PRIMARY_COLOR} /> {key}
                                                </span>
                                                <span className="font-semibold">
                                                    {currency}
                                                    {value}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {editingId === inf._id ? (
                            <div className="p-4 pt-0 flex flex-col gap-3">
                                <p className="font-bold text-lg text-gray-800 border-t pt-3">
                                    Edit Details
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(editRates).map((key) => {
                                        const Icon = rateIconMap[key];

                                        return (
                                            <div key={key}>
                                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                                    <Icon size={12} color={PRIMARY_COLOR} /> {key} (
                                                    {currency})
                                                </label>

                                                <input
                                                    type="number"
                                                    value={editRates[key]}
                                                    onChange={(e) =>
                                                        setEditRates({
                                                            ...editRates,
                                                            [key]: e.target.value,
                                                        })
                                                    }
                                                    className="border px-3 py-2 rounded-lg text-sm w-full"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    {Object.keys(editSocialLinks).map((key) => {
                                        const Icon = socialIconMap[key];

                                        return (
                                            <div key={key}>
                                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                                    <Icon size={12} color={PRIMARY_COLOR} /> {key}
                                                </label>

                                                <input
                                                    type="text"
                                                    value={editSocialLinks[key] || ''}
                                                    onChange={(e) =>
                                                        setEditSocialLinks({
                                                            ...editSocialLinks,
                                                            [key]: e.target.value,
                                                        })
                                                    }
                                                    className="border px-3 py-2 rounded-lg text-sm w-full"
                                                    placeholder={`https://${key}.com/...`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={saveEdit}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex justify-center items-center font-semibold"
                                    >
                                        <FaSave className="mr-2" /> Save
                                    </button>

                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg flex justify-center items-center font-semibold"
                                    >
                                        <FaTimes className="mr-2" /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="p-4 border-t"
                                style={{ borderColor: SECONDARY_COLOR }}
                            >
                                <button
                                    onClick={() => startEdit(inf)}
                                    className="w-full border px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                    style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                                >
                                    <FaEdit className="mr-2 inline-block" /> Edit Details
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfluencersList;
