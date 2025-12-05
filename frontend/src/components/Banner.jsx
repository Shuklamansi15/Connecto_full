import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();
    
    // FIX 1: Text changed to "Book Consultation"
    // FIX 2: Text changed to "Trusted Content Creators"

    return (
        <div className='flex bg-[#1999d5] rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 items-center overflow-hidden'> 
            {/* left side - Content */}
            {/* Added pr-4 for small screens and adjusted padding for larger screens */}
            <div className='flex-1 py-8 sm:py-10 md:py-24 lg:pl-5 pr-4'> 
                <div className='text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-white'>
                    <p>Book Consultation</p>
                    {/* Increased bottom margin for text on larger screens */}
                    <p className='mt-3 sm:mt-4 md:mt-5 text-lg sm:text-xl md:text-3xl lg:text-4xl font-normal'>
                        With 100+ Trusted Content Creators
                    </p>
                </div>
                {/* Made button slightly bigger and adjusted spacing */}
                <button 
                    onClick={() => { navigate('/login'); window.scrollTo(0, 0); }} 
                    className='bg-white text-base sm:text-lg text-gray-800 px-10 py-3 rounded-full mt-8 md:mt-10 hover:scale-105 transition-all shadow-lg font-medium'
                >
                    Create account
                </button>
            </div>

            {/* right side - Image */}
            {/* The primary fix is here: ensuring the image has the correct container size and is positioned correctly */}
            <div className='hidden md:flex md:justify-end md:w-1/2 lg:w-[450px] md:h-[350px] lg:h-[400px] relative -mr-12'> 
                {/* FIX 3: Image asset changed to 'inf10' and styling adjusted for better display */}
                {/* The image now scales within its container and is pushed to the right edge (using -mr-12 on the parent) */}
                <img 
                    className='h-full w-auto object-contain' 
                    src={assets.contact_image} 
                    alt='Influencer group chatting'
                />
            </div>
        </div>
    );
};

export default Banner;