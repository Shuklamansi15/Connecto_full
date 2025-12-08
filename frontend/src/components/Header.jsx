import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    // Styling kept the same as it was fixed in the previous step
    <div className='flex flex-col md:flex-row flex-wrap bg-[#1999d5] rounded-xl px-6 md:px-10 lg:px-20 py-10 mt-10 md:py-0 mb-10'>

      {/* left side */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 md:py-20 lg:py-24 m-auto md:m-0'>
        {/* UPDATED CONTENT: Headline for connecting with influencers */}
        <p className='text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-tight'>
          Connect Instantly <br/>with Your Favorite Influencers
        </p>

        {/* Profiles and Text Group */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 text-white text-sm font-light'>
          {/* Asset usage remains the same, but alt text is updated */}
          <img className='w-24 sm:w-28' src={assets.group_profiles} alt='Group of influencer profiles' />
          <p>
            {/* UPDATED CONTENT: Description for chat, video, and calls */}
            Chat, video call, or hop on a voice call with the stars
            <br className='hidden sm:block'/> you love, directly and hassle-free.
          </p>
        </div>

        {/* Button */}
        {/* UPDATED CONTENT: Button text changed from 'Book Appointment' to 'Start Connecting' */}
        <a href='influencers' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-[1.02] transition-all duration-300 font-medium' >
          Start Connecting <img className='w-3' src={assets.arrow_icon} alt='Arrow' />
        </a>
      </div>

      {/* right side */}
      <div className='md:w-1/2 relative flex items-end justify-center pt-8 md:pt-0'>
        {/* Alt text updated */}
        <img 
          className='w-full max-h-[400px] md:max-h-full md:w-auto md:h-full object-contain' 
          src={assets.influencer_img} 
          alt='Influencers using their phones'
        />
      </div>
    </div>
  )
}

export default Header