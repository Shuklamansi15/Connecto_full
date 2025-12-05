import React, { useContext, useEffect, useState } from 'react';
import { InfluencerContext } from '../../context/InfluencerContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

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
      <div className="m-5 text-center text-lg text-gray-500 p-10 bg-white rounded-xl shadow">
        🔑 Please log in to view and manage your profile.
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="m-5 flex flex-col items-center p-10 bg-white rounded-xl shadow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary border-t-4"></div>
        <p className="mt-4 text-gray-600">Loading your profile data...</p>
      </div>
    );
  }

  const handleCancelEdit = () => {
    getProfileData();
    setIsEdit(false);
  };

  return (
    <div className="m-5 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Influencer Profile ⚙️</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 flex flex-col items-center bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary transition-all hover:shadow-xl">
          <img
            className="w-48 h-48 object-cover rounded-full shadow-xl mb-4 border-4 border-white"
            src={profile.image || '/default-avatar.jpg'}
            alt={profile.name || 'Influencer'}
          />
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
          <p className="text-sm text-gray-700 mt-2">Followers: {profile.followers || 0}</p>

          {/* Availability Toggle */}
          <div className="mt-6 flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-lg w-full">
            <span className="text-sm font-medium text-gray-700">Available:</span>
            <button
              onClick={() => isEdit && setProfileData({ ...profile, available: !profile.available })}
              className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 ${
                profile.available ? 'bg-green-500' : 'bg-gray-400'
              } ${isEdit ? 'cursor-pointer' : 'pointer-events-none'}`}
            >
              <span
                className={`inline-block h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                  profile.available ? 'translate-x-7' : 'translate-x-0'
                }`}
              ></span>
            </button>
            <span className={`text-sm font-bold ${profile.available ? 'text-green-600' : 'text-gray-500'}`}>
              {profile.available ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl">
          <div className="flex justify-end mb-6 space-x-3">
            {isEdit && (
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="px-5 py-2 text-sm font-medium rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Discard Changes
              </button>
            )}
            <button
              onClick={isEdit ? updateProfile : () => setIsEdit(true)}
              disabled={isLoading}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all shadow-md ${
                isEdit
                  ? 'bg-primary text-white hover:bg-primary/90 disabled:bg-gray-400'
                  : 'border border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="space-y-6">
            {/* About Section */}
            <div className="border p-4 rounded-lg bg-gray-50">
              <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
              {isEdit ? (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={6}
                  value={profile.about || ''}
                  onChange={(e) => setProfileData({ ...profile, about: e.target.value })}
                  placeholder="Tell clients about your expertise and style..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed min-h-[100px]">
                  {profile.about || <span className="text-gray-400 italic">No description added yet.</span>}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              {isEdit ? (
                <input
                  type="text"
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={profile.category || ''}
                  onChange={(e) => setProfileData({ ...profile, category: e.target.value })}
                  placeholder="Enter your category (e.g., Fashion, Tech)"
                />
              ) : (
                <div className="py-2 text-gray-600">{profile.category || 'Not specified'}</div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Social Media Links</label>
              {['instagram', 'youtube', 'twitter', 'facebook'].map((platform) => (
                <div key={platform} className="mb-3">
                  <input
                    type="text"
                    disabled={!isEdit}
                    placeholder={`Enter your ${platform} URL`}
                    value={profile.socialLinks?.[platform] || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profile,
                        socialLinks: { ...profile.socialLinks, [platform]: e.target.value },
                      })
                    }
                    className={`w-full pl-3 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isEdit ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed border-gray-200'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
