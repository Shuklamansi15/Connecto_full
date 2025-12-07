import React from 'react';
import { assets } from '../assets/assets';

// Define custom color variables 
const PRIMARY_COLOR_CLASS = 'bg-[#1999d5]';
const PRIMARY_TEXT_CLASS = 'text-[#1999d5]';
const PRIMARY_HOVER_CLASS = 'hover:bg-[#1580b0]'; // Slightly darker for hover
const ACCENT_BG_CLASS = 'bg-[#1999d5]/5'; // Very light background accent

const About = () => {
  // Use 'Connecto' as the platform name
  const PLATFORM_NAME = 'Connecto';

  // Component for the "Why Choose Us" cards
  const FeatureCard = ({ title, description }) => (
    <div className={`p-8 flex flex-col gap-4 text-base border border-gray-200 rounded-xl bg-white shadow-md transition-all duration-300 cursor-pointer 
                   hover:shadow-xl hover:bg-blue-50 hover:scale-[1.02] group`}>
      <b className={`text-lg font-bold text-gray-800 transition-colors duration-300 ${PRIMARY_TEXT_CLASS} group-hover:text-[#1580b0]`}>
        {title}
      </b>
      <p className='text-sm text-gray-600 leading-relaxed'>
        {description}
      </p>
    </div>
  );

  return (
    <div className='max-w-6xl mx-auto px-4 py-16 bg-white min-h-screen'>
      
      {/* --- Title Section --- */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl font-extrabold text-gray-900'>
          ABOUT <span className={PRIMARY_TEXT_CLASS}>{PLATFORM_NAME}</span>
        </h1>
        <p className='text-lg text-gray-500 mt-2'>Your direct link to creator expertise and success.</p>
      </div>

      {/* --- Main Content Section (Split Layout) --- */}
      <div className='my-10 flex flex-col md:flex-row gap-12 lg:gap-20 items-start'>
        
        {/* Image Column */}
        <div className='w-full md:w-5/12'>
          <img 
            className='w-full rounded-2xl shadow-2xl border-4 border-white object-cover transform transition-transform duration-300 hover:scale-[1.01]' 
            src={assets.influencer_img} // Assuming this is the correct asset key
            alt="Influencer collaboration setup"
          />
        </div>

        {/* Text Content Column */}
        <div className='flex flex-col justify-center gap-6 md:w-7/12 text-base text-gray-700'>
          
          <p className='text-xl font-semibold text-gray-900'>
            Welcome to {PLATFORM_NAME} — the premier platform connecting you with verified top-tier influencers for personalized, one-on-one virtual consultations.
          </p>

          <div className='p-5 rounded-xl border border-gray-200'>
            <p className='leading-relaxed'>
              We simplify the process of engaging with experts across gaming, finance, fashion, and marketing, offering a seamless booking experience right from your desktop or mobile device. Our mission is to transform advice-seeking into an actionable, scheduled session.
            </p>
          </div>

          <div className={`p-5 rounded-xl border-l-4 border-[#1999d5] ${ACCENT_BG_CLASS}`}>
            <b className='text-lg font-bold text-gray-800 mb-2 block'>Our Vision: Empowering Connection</b>
            <p className='text-sm leading-relaxed text-gray-700'>
              Our vision is to revolutionize the creator economy by bridging the gap between audiences/brands and qualified influencers. We strive to empower every user with technology-driven consultation solutions that are fast, secure, and highly personalized to help them achieve their learning or marketing goals.
            </p>
          </div>
        </div>
      </div>

      {/* --- Why Choose Us Section (Grid) --- */}
      <div className='mt-24 mb-12'>
        <h2 className='text-3xl font-extrabold text-gray-900 border-b pb-3'>
          WHY <span className={PRIMARY_TEXT_CLASS}>CHOOSE {PLATFORM_NAME}</span>
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 border-blue-950 gap-8 mb-20'>
        <FeatureCard
          title="Niche Access"
          description="Instantly book personalized consultations with verified influencers across diverse, specific categories you care about."
        />
        <FeatureCard
          title="Seamless Convenience"
          description="Get direct access to expert content creators for advice or collaboration, anytime, anywhere, with effortless scheduling and reminders."
        />
        <FeatureCard
          title="Security & Trust"
          description="We verify all influencer profiles and secure all payments, ensuring a safe, transparent, and trustworthy consultation experience."
        />
      </div>
    </div>
  );
};

export default About;