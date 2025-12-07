import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../contex/AppContext'
import SearchBar from './SearchBar'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)
  const [searchInput, setSearchInput] = useState("")

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim() !== "") {
      navigate(`/influencers?search=${searchInput}`)
    }
  }

  return (
    <div className='flex items-center justify-between text-sm h-20 py-4 mb-5 border-b border-gray-200 sticky top-0 bg-white z-50 px-4'>

      {/* Logo */}
      <img 
        onClick={() => navigate('/')} 
        className='w-32 md:w-44 cursor-pointer hover:opacity-80 h-fit transition-all duration-300' 
        src={assets.logo1} 
        alt="logo" 
      />

      {/* Desktop Menu - Remains hidden on mobile */}
      <ul className='md:flex items-start gap-6 font-medium hidden text-gray-700'>
        {['HOME', 'INFLUENCERS', 'ABOUT', 'CONTACT'].map((item) => (
          <NavLink key={item} to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`}>
            {({ isActive }) => (
              <li className={`py-1 relative group cursor-pointer ${isActive ? "text-[#1999d5]" : "hover:text-black"}`}>
                {item}
                <hr className={`h-0.5 bg-[#1999d5] absolute bottom-0 left-0 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-1/2"}`} />
              </li>
            )}
          </NavLink>
        ))}
      </ul>

      {/* Search Section - Now visible on ALL screens via flex-1 */}
      <div className="flex items-center flex-1 max-w-[150px] sm:max-w-sm px-2 sm:px-6">
        <SearchBar className="w-full" />
      </div>

      {/* Right side Actions */}
      <div className='flex items-center gap-2 sm:gap-4'>
        {token && userData ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <div className='p-0.5 border-2 border-transparent group-hover:border-[#1999d5] rounded-full transition-all'>
              <img 
                className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-sm'
                src={userData.image || assets.avatar_placeholder} 
                alt="user"
              />
            </div>
            <img className='w-2.5 opacity-60 group-hover:rotate-180 transition-transform duration-300' src={assets.dropdown_icon} alt="dropdown" />

            <div className='absolute top-full right-0 pt-3 text-base font-medium text-gray-600 z-20 hidden group-hover:block transition-all'>
              <div className='min-w-56 bg-white border border-gray-100 rounded-lg flex flex-col shadow-2xl overflow-hidden'>
                <p onClick={() => navigate('/my-profile')} className='px-4 py-3 hover:bg-gray-50 hover:text-[#1999d5] transition-colors'>My Profile</p>
                <p onClick={() => navigate('/my-consultations')} className='px-4 py-3 hover:bg-gray-50 hover:text-[#1999d5] transition-colors'>My Consultations</p>
                <hr className='border-gray-50' />
                <p onClick={logout} className='px-4 py-3 hover:bg-red-50 hover:text-red-500 transition-colors'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[#1999d5] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full font-light hidden sm:block hover:bg-[#1999d5]/90 transition-all active:scale-95'
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setShowMenu(true)} 
          className='p-2 md:hidden bg-gray-100 rounded-full transition-colors'
        >
          <img className='w-5 sm:w-6 cursor-pointer' src={assets.menu_icon} alt="menu" />
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-50 transition-all duration-500 transform ${showMenu ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-white`}>
          <div className='flex items-center justify-between px-5 py-6 border-b'>
            <img src={assets.logo1} className='w-36' alt="logo" />
            <button 
              onClick={() => setShowMenu(false)}
              className='p-2 rounded-full bg-gray-100 transition-colors'
            >
              <img src={assets.cross_icon} className='w-6 cursor-pointer' alt="close" />
            </button>
          </div>

          <div className='p-6'>
            {/* Keeping mobile internal search for redundancy or removing if top bar is enough */}
            <form 
              onSubmit={handleSearch}
              className='flex items-center border border-gray-100 px-4 py-3 rounded-xl bg-gray-50 shadow-inner mb-8'
            >
              <input
                type='text'
                placeholder='Search influencer...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='bg-transparent outline-none text-base w-full'
              />
              <button type="submit" className='p-1'>
                <img src={assets.search_icon} className='w-5 opacity-60' alt="search" />
              </button>
            </form>

            <ul className='flex flex-col gap-3 text-lg font-medium'>
              {['HOME', 'INFLUENCERS', 'ABOUT', 'CONTACT'].map((label) => (
                <NavLink 
                  key={label}
                  onClick={() => setShowMenu(false)} 
                  to={label === 'HOME' ? '/' : `/${label.toLowerCase()}`}
                  className={({isActive}) => `px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#1999d5]/10 text-[#1999d5]' : 'hover:bg-gray-50'}`}
                >
                  {label}
                </NavLink>
              ))}

              <div className='mt-6 pt-6 border-t border-gray-100'>
                {token ? (
                  <p className='px-4 py-3 text-red-500 bg-red-50 rounded-lg cursor-pointer'
                    onClick={() => { setShowMenu(false); logout(); }}>Logout</p>
                ) : (
                  <p className='px-4 py-3 bg-[#1999d5] text-white rounded-lg text-center cursor-pointer shadow-md shadow-[#1999d5]/20'
                    onClick={() => { setShowMenu(false); navigate('/login'); }}>Login</p>
                )}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;