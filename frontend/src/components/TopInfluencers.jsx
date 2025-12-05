import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../contex/AppContext'
import { ArrowRight } from 'lucide-react' // Added icon for the button

const TopInfluencers = () => {

    const navigate = useNavigate()

    const { Influencers } = useContext(AppContext)

    // Define a subtle theme color for consistency
    const themeColor = '#1999d5';

    return (
        <div className='flex flex-col items-center gap-6 my-16 text-gray-900 px-4 md:px-8 max-w-7xl mx-auto'>
            
            {/* Header Section Improvement */}
            <div className='text-center mb-6'>
                <h1 className='text-4xl font-extrabold text-gray-900 mb-3'>
                    ⭐ Top Rated Influencers to Consult 
                </h1>
                <p className='max-w-xl mx-auto text-lg text-gray-500'>
                    Browse through our curated list of trusted experts to start your consultation today.
                </p>
            </div>

            {/* Influencer Grid Improvement */}
            <div className='w-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5'>
                {Influencers.slice(0, 10).map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
                        className={`bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer 
                            shadow-lg hover:shadow-2xl 
                            transform hover:scale-[1.03] transition-all duration-300 ease-in-out 
                            focus:outline-none focus:ring-4 focus:ring-[${themeColor}] focus:ring-opacity-50`} // Enhanced card styling
                        key={index}
                        tabIndex={0} // Makes the div focusable for accessibility
                        onKeyDown={(e) => { // Allows activation with keyboard
                            if (e.key === 'Enter' || e.key === ' ') {
                                navigate(`/appointment/${item._id}`);
                                window.scrollTo(0, 0);
                            }
                        }}
                    >
                        {/* Image Section */}
                        <div className='relative w-full h-40 bg-gray-50 overflow-hidden'> 
                            <img 
                                className='w-full h-full object-cover transition-opacity duration-300 hover:opacity-90' 
                                src={item.image} 
                                alt={item.name} 
                            />
                        </div>
                        
                        {/* Content Section */}
                        <div className='p-4 md:p-5'>
                            
                            {/* Availability Tag - More prominent and clear */}
                            <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full w-fit mb-2 ${
                                item.available 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-yellow-500"}`}></p>
                                <p>{item.available ? 'Available Now' : "Check Schedule"}</p>
                            </div>

                            {/* Name and Speciality */}
                            <p className='text-gray-900 text-lg font-bold truncate mb-0.5'>{item.name}</p>
                            <p className='text-gray-500 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Button Improvement - Clearer CTA and modern styling */}
            <button 
                onClick={() => { navigate('/Influencers'); window.scrollTo(0, 0) }} 
                className={`bg-[${themeColor}] text-white font-bold px-8 py-3 rounded-full mt-10 shadow-xl 
                    hover:bg-opacity-90 transition-all duration-300 
                    flex items-center gap-2 text-base`}
            >
                View All Influencers 
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>

    )
}

export default TopInfluencers