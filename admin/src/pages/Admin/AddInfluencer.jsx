import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import NotificationCard from '../../components/NotificationCard';

// Define a primary color for consistency
const PRIMARY_COLOR = '#1999d5';

// --- Constants for Circular Progress Bar (SVG) ---
const RADIUS = 60;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Helper to calculate stroke-dashoffset
const getDashoffset = (progress) => CIRCUMFERENCE * (1 - progress / 100);

const AddInfluencer = () => {
  const [infImg, setInfImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState('Gaming');
  const [followers, setFollowers] = useState('');
  const [about, setAbout] = useState('');

  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');

  const [rateChat, setRateChat] = useState('');
  const [rateCall, setRateCall] = useState('');
  const [rateVideo, setRateVideo] = useState('');

  // NEW: notification state
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    title: '',
    show: false,
  });

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!infImg) {
        return setNotification({
          type: 'warning',
          message: 'Image Not Selected',
          title: 'Warning!',
          show: true,
        });
      }

      const formData = new FormData();
      formData.append('image', infImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('category', category);
      formData.append('followers', followers);
      formData.append('about', about);

      formData.append(
        'socialLinks',
        JSON.stringify({ instagram, youtube, facebook, twitter, tiktok })
      );

      formData.append(
        'rates',
        JSON.stringify({ chat: rateChat, call: rateCall, video: rateVideo })
      );

      formData.append('date', Date.now());

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-influencer',
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        setNotification({
          type: 'success',
          message: data.message,
          title: 'Success!',
          show: true,
        });

        // Reset all fields
        setInfImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setFollowers('');
        setAbout('');
        setInstagram('');
        setYoutube('');
        setFacebook('');
        setTwitter('');
        setTiktok('');
        setRateChat('');
        setRateCall('');
        setRateVideo('');
      } else {
        setNotification({
          type: 'error',
          message: data.message,
          title: 'Error!',
          show: true,
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
        title: 'Error!',
        show: true,
      });
      console.log(error);
    }
  };

  return (
    <>
      {/* NotificationCard */}
      {notification.show && (
        <NotificationCard
          type={notification.type}
          message={notification.message}
          title={notification.title}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <form onSubmit={onSubmitHandler} className='m-5 w-full'>
        <p className='mb-3 text-lg font-medium'>Add Influencer</p>

        <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
          <div className='flex items-center gap-4 mb-8 text-gray-500'>
            <label htmlFor='inf-img'>
              <img
                className='w-20 h-20 object-cover bg-gray-100 rounded-full cursor-pointer border-2 border-dashed hover:border-solid border-gray-300'
                src={infImg ? URL.createObjectURL(infImg) : assets.upload_area}
                alt='Upload Image'
              />
            </label>
            <input
              onChange={(e) => setInfImg(e.target.files[0])}
              type='file'
              id='inf-img'
              hidden
              required
            />
            <p>
              Upload influencer <br /> picture
            </p>
          </div>

          <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
            {/* LEFT */}
            <div className='w-full lg:flex-1 flex flex-col gap-4'>
              <div className='flex-1 flex flex-col gap-1'>
                <p>Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='text'
                  placeholder='Name'
                  required
                />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Email</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='email'
                  placeholder='Email'
                  required
                />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Password</p>
                <div className='relative'>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition pr-10`}
                    placeholder='Password'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? (
                      <span>👁️</span>
                    ) : (
                      <span>🙈</span>
                    )}
                  </button>
                </div>
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Category</p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className={`border rounded px-2 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                >
                  <option value='Gaming'>Gaming</option>
                  <option value='Tech'>Tech</option>
                  <option value='Fashion'>Fashion</option>
                  <option value='Fitness'>Fitness</option>
                  <option value='Finance'>Finance</option>
                  <option value='Art'>Art</option>
                  <option value='Cooking'>Cooking</option>
                  <option value='Travel'>Travel</option>
                  <option value='Lifestyle'>Lifestyle</option>
                </select>
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Followers</p>
                <input
                  onChange={(e) => setFollowers(e.target.value)}
                  value={followers}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='number'
                  placeholder='Total followers'
                  required
                />
              </div>
            </div>

            {/* RIGHT (Social Links) */}
            <div className='w-full lg:flex-1 flex flex-col gap-4'>
              <div className='flex-1 flex flex-col gap-1'>
                <p>Instagram</p>
                <input
                  onChange={(e) => setInstagram(e.target.value)}
                  value={instagram}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='text'
                  placeholder='Instagram link'
                />
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <p>YouTube</p>
                <input
                  onChange={(e) => setYoutube(e.target.value)}
                  value={youtube}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='text'
                  placeholder='YouTube link'
                />
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <p>Facebook</p>
                <input
                  onChange={(e) => setFacebook(e.target.value)}
                  value={facebook}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='text'
                  placeholder='Facebook link'
                />
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <p>Twitter</p>
                <input
                  onChange={(e) => setTwitter(e.target.value)}
                  value={twitter}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='text'
                  placeholder='Twitter link'
                />
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <p>TikTok</p>
                <input
                  onChange={(e) => setTiktok(e.target.value)}
                  value={tiktok}
                  className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                  type='text'
                  placeholder='TikTok link'
                />
              </div>
            </div>
          </div>

          {/* RATES */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-5'>
            <div className='flex flex-col gap-1'>
              <p>Chat Rate</p>
              <input
                onChange={(e) => setRateChat(e.target.value)}
                value={rateChat}
                className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                type='number'
                placeholder='Chat rate'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <p>Call Rate</p>
              <input
                onChange={(e) => setRateCall(e.target.value)}
                value={rateCall}
                className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                type='number'
                placeholder='Call rate'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <p>Video Rate</p>
              <input
                onChange={(e) => setRateVideo(e.target.value)}
                value={rateVideo}
                className={`border rounded px-3 py-2 w-full focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
                type='number'
                placeholder='Video rate'
              />
            </div>
          </div>

          <div>
            <p className='mt-4 mb-2'>About Influencer</p>
            <textarea
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              className={`w-full px-4 pt-2 border rounded focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none transition`}
              rows={5}
              placeholder='Write about influencer'
            ></textarea>
          </div>

          <button
            type='submit'
            className={`px-10 py-3 mt-4 text-white rounded-full bg-[#1571a0] transition-colors`}
          >
            Add Influencer
          </button>
        </div>
      </form>
    </>
  );
};

export default AddInfluencer;
