import React, { useContext, useEffect, useState } from 'react';
import { InfluencerContext } from '../../context/InfluencerContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// React Icons
import { FiEdit2, FiCheckCircle, FiXCircle, FiInstagram, FiYoutube, FiTwitter, FiFacebook } from 'react-icons/fi';
import { MdOutlineCategory, MdPerson } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const InfluencerProfile = () => {
  const { iToken, profileData, setProfileData, getProfileData } = useContext(InfluencerContext);
  const { backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const profile = profileData || {};

  useEffect(() => {
    if (iToken && !profileData) {
      getProfileData();
    }
  }, [iToken, profileData, getProfileData]);

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        about: profile.about?.trim() || '',
        available: profile.available || false,
        category: profile.category?.trim() || '',
        socialLinks: profile.socialLinks || {},
      };

      const { data } = await axios.post(
        `${backendUrl}/api/influencer/update-profile`,
        updateData,
        { headers: { iToken } }
      );

      if (data.success) {
        toast.success(data.message || 'Profile updated successfully! 🎉');
        setIsEdit(false);
        await getProfileData();
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!iToken) {
    return (
      <div className="m-8 text-center text-lg text-gray-500 p-12 bg-white rounded-2xl shadow-xl max-w-lg mx-auto border border-gray-100">
        <span className="text-4xl block mb-4">🔑</span>
        <p className="font-semibold text-gray-800">Please log in to manage your profile.</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="m-10 flex flex-col items-center justify-center p-16 bg-white rounded-2xl shadow-sm">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-primary" />
        <p className="mt-6 text-gray-500 font-medium">Loading profile data...</p>
      </div>
    );
  }

  const handleCancelEdit = () => {
    getProfileData();
    setIsEdit(false);
  };

  const socialIcons = {
    instagram: <FiInstagram className="text-pink-500" />,
    youtube: <FiYoutube className="text-red-600" />,
    twitter: <FiTwitter className="text-blue-400" />,
    facebook: <FiFacebook className="text-blue-600" />,
  };

  return (
    <div className="m-5 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          Profile <FiEdit2 className="text-primary" />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar Card */}
        <div className="lg:col-span-4 flex flex-col items-center bg-white rounded-2xl shadow-md p-8 border border-gray-100 h-fit sticky top-24">
          <div className="relative">
            <img
              className="w-40 h-40 object-cover rounded-full shadow-2xl mb-6 ring-4 ring-gray-50"
              src={profile.image || '/default-avatar.jpg'}
              alt={profile.name || 'Influencer'}
            />
            {profile.available && <span className="absolute bottom-6 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full animate-pulse"></span>}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center flex items-center gap-2">
            <MdPerson /> {profile.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium tracking-wide uppercase">{profile.email}</p>
          
          <div className="mt-4 bg-primary/5 px-4 py-1.5 rounded-full">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">
              Followers: {profile.followers?.toLocaleString() || 0}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center space-y-3 p-4 bg-gray-50 rounded-2xl w-full border border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-gray-600 tracking-tight">Public Availability</span>
              <button
                onClick={() => isEdit && setProfileData({ ...profile, available: !profile.available })}
                className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-500 shadow-inner ${
                  profile.available ? 'bg-green-500' : 'bg-gray-300'
                } ${isEdit ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
              >
                <span
                  className={`inline-block h-6 w-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-out ${
                    profile.available ? 'translate-x-9' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>
            <span className={`text-[10px] font-black tracking-widest flex items-center gap-1 ${
              profile.available ? 'text-green-600' : 'text-gray-400'
            }`}>
              {profile.available ? <FiCheckCircle /> : <FiXCircle />} {profile.available ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Form Details Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-md border border-gray-100 p-8 lg:p-10 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
             <span className="text-lg font-bold text-gray-800 flex items-center gap-2">
               <MdOutlineCategory /> Influencer Information
             </span>
             <div className="flex space-x-3">
              {isEdit && (
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm font-bold rounded-xl text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 flex items-center gap-1"
                >
                  <FiXCircle /> Discard
                </button>
              )}
              <button
                onClick={isEdit ? updateProfile : () => setIsEdit(true)}
                disabled={isLoading}
                className={`px-7 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                  isEdit
                    ? 'bg-primary text-white hover:shadow-primary/25 disabled:bg-gray-400'
                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {isLoading ? 'Processing...' : isEdit ? 'Update My Info' : 'Modify Profile'} {isEdit ? <FiCheckCircle /> : <FiEdit2 />}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* About Section */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                <FiEdit2 /> Biography
              </label>
              {isEdit ? (
                <textarea
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none text-gray-700 leading-relaxed"
                  rows={6}
                  value={profile.about || ''}
                  onChange={(e) => setProfileData({ ...profile, about: e.target.value })}
                  placeholder="Share your expertise with potential clients..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 min-h-[120px]">
                  {profile.about || <span className="text-gray-400 italic font-light">Introduce yourself to the world.</span>}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Category Dropdown */}
              <div className="w-full space-y-3">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                  <MdOutlineCategory /> Niche / Category
                </label>
                {isEdit ? (
                  <select
                    value={profile.category || ''}
                    onChange={(e) => setProfileData({ ...profile, category: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer text-gray-700"
                  >
                    <option value="">Select Category</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Tech">Tech</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Finance">Finance</option>
                    <option value="Art">Art</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Travel">Travel</option>
                     <option value="Lifestyle">Lifestyle</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-semibold border border-transparent flex items-center gap-2">
                    <MdOutlineCategory /> {profile.category || 'Not specified'}
                  </p>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-5">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                Connected Platforms
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['instagram', 'youtube', 'twitter', 'facebook'].map((platform) => (
                  <div key={platform} className="group">
                    <div className={`flex items-center rounded-xl transition-all border ${isEdit ? 'border-gray-200 bg-white focus-within:ring-4 focus-within:ring-primary/10' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                      <span className="pl-4 text-xl">{socialIcons[platform]}</span>
                      <input
                        type="text"
                        disabled={!isEdit}
                        placeholder={`${platform} URL`}
                        value={profile.socialLinks?.[platform] || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profile,
                            socialLinks: { ...profile.socialLinks, [platform]: e.target.value },
                          })
                        }
                        className="w-full p-3.5 bg-transparent outline-none text-sm font-medium text-gray-600 placeholder-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
