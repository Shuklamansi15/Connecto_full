import React from 'react';
import { assets } from '../assets/assets'; // Ensure assets.contact_image is defined in your assets.js

// Define custom color variables 
const PRIMARY_COLOR_CLASS = 'bg-[#1999d5]';
const PRIMARY_TEXT_CLASS = 'text-[#1999d5]';
const PRIMARY_HOVER_CLASS = 'hover:bg-[#1580b0]'; // Slightly darker for hover
const BORDER_COLOR_CLASS = 'border-[#1999d5]';
const RING_COLOR_CLASS = 'focus:ring-4 focus:ring-[#1999d5]/30'; // Added stronger focus ring
const HOVER_SHADOW_CLASS = 'hover:shadow-2xl transition-all duration-500';

// Reusable component for contact details (Animated)
const ContactInfoCard = ({ icon, title, content, link }) => (
    <div className={`p-3 rounded-xl border border-gray-100 bg-white shadow-lg ${HOVER_SHADOW_CLASS} hover:border-gray-300 transform hover:-translate-y-1`}>
        <span className={`text-3xl ${PRIMARY_TEXT_CLASS} mb-3 block`}>{icon}</span>
        <p className='font-extrabold text-lg text-gray-900 mb-1'>{title}</p>
        {link ? (
            <a 
                href={link.url} 
                className='text-sm text-gray-600 hover:text-gray-900 transition-colors underline-offset-4 hover:underline'
                target={link.external ? "_blank" : "_self"}
                rel={link.external ? "noopener noreferrer" : undefined}
            >
                {content}
            </a>
        ) : (
            <p className='text-sm text-gray-600'>{content}</p>
        )}
    </div>
);

const Contact = () => {
    const PLATFORM_NAME = 'Connecto';

    return (
        <div className='bg-gray-50 min-h-screen py-16'>
            <div className='max-w-7xl mx-auto px-4'>
                
                {/* --- Header Section --- */}
                <div className='text-center mb-16 pt-8'>
                    <h1 className='text-5xl font-extrabold text-gray-900'>
                        Let's <span className={PRIMARY_TEXT_CLASS}>Connect</span>
                    </h1>
                    <p className='text-xl text-gray-600 mt-4 max-w-2xl mx-auto'>
                        Whether you're a user needing support or an influencer looking to partner, our team is here to help you get started with {PLATFORM_NAME}.
                    </p>
                </div>

                {/* --- Main Contact Grid (Image + Form/Info) --- */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                    {/* --- Column 1: Image & Info Cards (Left Side) --- */}
                    <div className='flex flex-col gap-8'>
                        {/* Contact Image */}
                        <img 
                            src={assets.contact_image} // Make sure this asset exists and is suitable
                            alt="Contact Us - Communication Network"
                            className='w-full rounded-2xl shadow-xl border-4 border-white object-cover transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl'
                        />

                        {/* Static Info Cards Grid */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <ContactInfoCard
                                icon="📧"
                                title="General Support"
                                content="support@connecto.co"
                                link={{ url: "mailto:support@connecto.co", external: false }}
                            />
                            <ContactInfoCard
                                icon="💼"
                                title="Partnerships"
                                content="partner@connecto.co"
                                link={{ url: "mailto:partner@connecto.co", external: false }}
                            />
                            <ContactInfoCard
                                icon="📞"
                                title="Business Inquiries"
                                content="+91 9899167518"
                                link={{ url: "tel:+91 9899167518", external: false }}
                            />
                            <ContactInfoCard
                                icon="📍"
                                title="Office Location"
                                content="123 Creator Way, Suite 400, San Francisco, CA 94107, USA"
                            />
                        </div>

                        {/* Careers CTA Card */}
                        <div className={`mt-4 p-8 rounded-xl ${PRIMARY_COLOR_CLASS} text-white shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                            <h3 className='text-2xl font-bold mb-2'>Career Opportunities</h3>
                            <p className='text-sm opacity-90 mb-4'>
                                Join our rapidly growing team and help shape the future of the creator economy.
                            </p>
                            <button 
                                className={`bg-white text-gray-900 font-semibold px-6 py-2 rounded-full text-sm transition-colors duration-300 hover:bg-gray-200 shadow-md`}
                                onClick={() => console.log("Navigate to careers page")} // Placeholder action
                            >
                                Explore Openings
                            </button>
                        </div>
                    </div>
                    
                    {/* --- Column 2: Contact Form (Right Side) --- */}
                    <div className='bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 h-fit sticky top-16'> {/* Added h-fit and sticky for better layout */}
                        <h2 className='text-3xl font-extrabold text-gray-800 mb-8'>Submit an Inquiry</h2>
                        <form className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            
                            {/* Full Name */}
                            <div className='md:col-span-1'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Jane Doe" 
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent ${RING_COLOR_CLASS} transition-all duration-300`}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className='md:col-span-1'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent ${RING_COLOR_CLASS} transition-all duration-300`}
                                    required
                                />
                            </div>

                            {/* Phone (Optional) */}
                            <div className='md:col-span-1'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number (Optional)</label>
                                <input 
                                    type="tel" 
                                    placeholder="(555) 123-4567" 
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent ${RING_COLOR_CLASS} transition-all duration-300`}
                                />
                            </div>

                            {/* Inquiry Type */}
                            <div className='md:col-span-1'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Inquiry Type</label>
                                <select 
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent ${RING_COLOR_CLASS} transition-all duration-300 bg-white`}
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select a reason...</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing/Payment</option>
                                    <option value="partnership">Influencer Partnership</option>
                                    <option value="general">General Question</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className='md:col-span-2'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Message</label>
                                <textarea 
                                    placeholder="How can we help you today?" 
                                    rows="6" 
                                    className={`w-full p-3 border h-28 border-gray-300 rounded-lg focus:outline-none focus:border-transparent ${RING_COLOR_CLASS} transition-all duration-300`}
                                    required
                                />
                            </div>
                            
                            {/* Submit Button */}
                            <div className='md:col-span-2'>
                                <button 
                                    type="submit" 
                                    className={`w-full ${PRIMARY_COLOR_CLASS} text-white text-lg font-bold px-8 py-3.5 rounded-xl ${PRIMARY_HOVER_CLASS} transition-all duration-300 transform hover:scale-[1.005] shadow-xl shadow-[#1999d5]/40 mt-4`}
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
