import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppContext } from '../contex/AppContext';
import { Search, List, Zap, MessageSquare, Phone, Video, Clock, X } from 'lucide-react';
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter, FaTiktok } from "react-icons/fa";

const Influencers = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { Influencers } = useContext(AppContext);

  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const themeColor = '#1999d5'; 
  const themeColorLight = 'rgba(25, 153, 213, 0.1)';

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  const applyFilter = () => {
    setIsLoading(true);
    setTimeout(() => { 
      let data = Influencers || [];
      if (category) data = data.filter((inf) => inf.category === category);
      if (searchQuery.trim() !== '') {
        data = data.filter(
          (inf) =>
            inf.name.toLowerCase().includes(searchQuery) ||
            inf.category.toLowerCase().includes(searchQuery)
        );
      }
      setFilteredInfluencers(data);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => { applyFilter(); }, [Influencers, category, searchQuery]);

  const categories = ['All Categories', 'Fashion', 'Lifestyle', 'Fitness', 'Beauty', 'Travel', 'Food'];

  const handleCategoryClick = (cat) => {
    const path = cat === 'All Categories' ? '/influencers' : `/influencers/${cat}`;
    navigate(path);
    if (window.innerWidth < 640) setShowFilters(false);
  };
  
  const handleClearSearch = () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('search');
    navigate(location.pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''));
  };

  const RateDisplay = ({ type, rate, theme }) => {
    let Icon, label;
    if (type === 'chat') { Icon = MessageSquare; label = 'Chat'; }
    else if (type === 'call') { Icon = Phone; label = 'Call'; }
    else if (type === 'video') { Icon = Video; label = 'Video'; }

    return (
      <div className="flex items-center gap-1">
        <Icon style={{ color: theme }} className="w-3 h-3" />
        <p className="text-gray-700 text-xs">{label}: ₹{rate}</p>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg animate-pulse'>
      <div className='w-full h-52 bg-gray-200'></div>
      <div className='p-5'>
        <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
        <div className='h-3 bg-gray-100 rounded w-1/3 mb-4'></div>
        <div className='flex flex-col space-y-2 pt-3 border-t border-gray-100'>
          <div className='h-3 bg-gray-200 rounded w-2/3'></div>
          <div className='grid grid-cols-2 gap-2'>
            <div className='h-3 bg-gray-100 rounded'></div>
            <div className='h-3 bg-gray-100 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
      <header className="mb-8 border-[#1999d5] border-gray-100 pb-4">
        <h1 className='text-3xl font-extrabold text-[#1999d5] mb-1 flex items-center gap-2'>
          <Zap style={{ color: themeColor }} className="w-7 h-7" />
          Find Your Perfect Influencer
        </h1>
        <p className='text-gray-600'>Browse trending categories or search for specific experts.</p>
      </header>

      <button
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
        aria-controls="category-filters"
        className="py-2 px-4 border rounded-xl text-sm font-bold transition-all sm:hidden mb-5 w-full flex justify-center items-center gap-2"
        style={ showFilters ? { backgroundColor: themeColor, color: '#fff', borderColor: themeColor } : { color: themeColor, borderColor: '#d1d5db' }}
      >
        {showFilters ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
        {showFilters ? 'Close Filters' : 'Filter by Category'}
      </button>

      <div className='flex flex-col sm:flex-row items-start gap-10'>
        <div
          id="category-filters"
          className={`flex-col gap-1 text-sm text-gray-700 w-full sm:w-60 p-5 bg-white rounded-2xl shadow-xl flex-shrink-0 sm:sticky sm:top-20 z-10 transition-all duration-300 ${showFilters ? 'flex' : 'hidden sm:flex'}`}
          style={{ minHeight: '300px' }}
        >
          <h3 className='text-lg font-bold text-gray-900 mb-4 border-[#1999d5] border-gray-100 pb-3 flex items-center gap-2'>
            <List style={{ color: themeColor }} className="w-5 h-5" />
            Categories
          </h3>

          <div className='space-y-1'>
            {categories.map((cat) => {
              const isAll = cat === 'All Categories';
              const isActive = isAll ? !category : category === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left pl-4 pr-3 py-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 text-sm ${isActive ? 'font-extrabold' : ''}`}
                  style={isActive ? { backgroundColor: themeColorLight, color: themeColor, boxShadow: `0 0 0 4px ${themeColor}33` } : {}}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className='w-full'>
          {(category || searchQuery) && (
            <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-lg flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className='font-semibold'>Viewing: {category || 'All Categories'}</span>
              {searchQuery && (
                <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                    <span className="text-gray-700">Search: "{searchQuery}"</span>
                    <button onClick={handleClearSearch} aria-label="Clear search query" className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </span>
              )}
              <button onClick={() => navigate('/influencers')} className="ml-auto text-blue-600 hover:text-blue-800 font-bold transition-colors">
                Clear All
              </button>
            </div>
          )}
          
          <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
              : filteredInfluencers.length > 0
                ? filteredInfluencers.map((item) => (
                  <div
                    key={item._id}
                    role="link"
                    tabIndex={0}
                    onClick={() => { navigate(`/consultation/${item._id}`); window.scrollTo(0, 0); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { navigate(`/consultation/${item._id}`); window.scrollTo(0, 0); } }}
                    className='group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[rgba(25,153,213,0.3)]'
                  >
                    <div className='relative'>
                      <img className='w-full h-full object-cover bg-gray-100 transition-opacity duration-300 group-hover:opacity-90' src={item.image} alt={item.name} />
                     
                    </div>

                    <div className='p-5'>
                      <p className='text-gray-900 text-xl font-bold truncate mb-1'>{item.name}</p>

                      {/* Category and social links inline */}
                      <div className='flex items-center justify-between mb-4'>
                        <span className='text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-gray-600 border border-gray-200 inline-block'>
                          {item.category}
                        </span>
                         {/* Availability */}
                            <div
                                className={`flex items-center gap-2 text-xs font-semibold px-2 py-2 rounded-full w-fit mt-2 mb-2 ${
                                    item.available 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                <p className={`w-2 h-2 rounded-full ${
                                    item.available ? 'bg-green-500' : "bg-red-500"
                                }`}></p>
                                <p>{item.available ? 'Available Now' : "Not Available"}</p>
                            </div>

                        {item.socialLinks && (
                          <div className="flex items-center gap-2 text-lg text-gray-600">
                            {item.socialLinks.instagram && <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-pink-500 transition-all"><FaInstagram /></a>}
                            {item.socialLinks.youtube && <a href={item.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-red-600 transition-all"><FaYoutube /></a>}
                            {item.socialLinks.facebook && <a href={item.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-blue-600 transition-all"><FaFacebook /></a>}
                            {item.socialLinks.twitter && <a href={item.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-blue-400 transition-all"><FaTwitter /></a>}
                            {item.socialLinks.tiktok && <a href={item.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#1999d5] hover:text-black transition-all"><FaTiktok /></a>}
                          </div>
                        )}
                      </div>

                      <div className='flex flex-col space-y-2 pt-3 border-t border-gray-100'>
                        <p className='text-sm font-bold text-gray-800 flex items-center gap-1'>
                          <Clock style={{ color: themeColor }} className="w-4 h-4" /> Consultation Rates:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {item.rates?.chat != null && <RateDisplay type="chat" rate={item.rates.chat} theme={themeColor} />}
                          {item.rates?.call != null && <RateDisplay type="call" rate={item.rates.call} theme={themeColor} />}
                          {item.rates?.video != null && <RateDisplay type="video" rate={item.rates.video} theme={themeColor} />}
                          {item.rates && item.rates.chat == null && item.rates.call == null && item.rates.video == null && (
                            <p className='text-gray-400 italic text-sm col-span-2'>Rates not yet configured.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                : (
                  <div className='col-span-full text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 shadow-inner flex flex-col items-center justify-center gap-4'>
                    <Zap className="w-10 h-10 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-800">Oops! No Experts Found.</h3>
                    <p className='text-gray-600 max-w-md'>We couldn't find any influencers matching your current {category || 'category'} and search criteria.</p>
                    <button onClick={() => navigate('/influencers')} style={{ backgroundColor: themeColor }} className='mt-2 px-6 py-2 text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-all'>Clear All Filters</button>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Influencers;
