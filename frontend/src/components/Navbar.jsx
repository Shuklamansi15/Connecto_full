import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../contex/AppContext'
import SearchBar from './SearchBar'


const Navbar = () => {

  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  // ⭐ Search State
  const [searchInput, setSearchInput] = useState("")

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  // ⭐ Search Handler → Navigates to influencers?search=text
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim() !== "") {
      navigate(`/influencers?search=${searchInput}`)
    }
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>

      {/* Logo */}
      <img 
        onClick={() => navigate('/')} 
        className='w-44 cursor-pointer' 
        src={assets.logo1} 
        alt="logo" 
      />

      {/* Desktop Menu */}
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/'>
          {({ isActive }) => (
            <li className={`py-1 ${isActive ? "text-primary" : ""}`}>
              HOME
              <hr className={`h-0.5 bg-primary w-3/5 m-auto ${isActive ? "" : "hidden"}`} />
            </li>
          )}
        </NavLink>

        <NavLink to='/influencers'>
          {({ isActive }) => (
            <li className={`py-1 ${isActive ? "text-primary" : ""}`}>
              INFLUENCERS
              <hr className={`h-0.5 bg-primary w-3/5 m-auto ${isActive ? "" : "hidden"}`} />
            </li>
          )}
        </NavLink>

        <NavLink to='/about'>
          {({ isActive }) => (
            <li className={`py-1 ${isActive ? "text-primary" : ""}`}>
              ABOUT
              <hr className={`h-0.5 bg-primary w-3/5 m-auto ${isActive ? "" : "hidden"}`} />
            </li>
          )}
        </NavLink>

        <NavLink to='/contact'>
          {({ isActive }) => (
            <li className={`py-1 ${isActive ? "text-primary" : ""}`}>
              CONTACT
              <hr className={`h-0.5 bg-primary w-3/5 m-auto ${isActive ? "" : "hidden"}`} />
            </li>
          )}
        </NavLink>
      </ul>
<div className="hidden md:flex">
  < SearchBar className="mr-4" />
</div>
      

      {/* Right side */}
      <div className='flex items-center gap-4'>
        
        {token && userData ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 h-8 rounded-full object-cover'
              src={userData.image || assets.avatar_placeholder} />

            <img className='w-2.5' src={assets.dropdown_icon} alt="dropdown" />

            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4 shadow-md'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-consultations')} className='hover:text-black cursor-pointer'>My Consultations</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img 
          onClick={() => setShowMenu(true)} 
          className='w-6 md:hidden cursor-pointer' 
          src={assets.menu_icon} 
        />

        {/* Mobile Menu */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>

          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo1} className='w-36' />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className='w-7 cursor-pointer'
            />
          </div>

          {/* ⭐ Mobile Search Bar */}
          <form 
            onSubmit={handleSearch}
            className='flex items-center border px-4 py-2 rounded-full bg-gray-100 mx-5 mt-3 mb-6'
          >
            <input
              type='text'
              placeholder='Search influencer...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='bg-transparent outline-none text-sm w-full'
            />
            <button type="submit">
              <img src={assets.search_icon} className='w-4' />
            </button>
          </form>

          <ul className='flex flex-col items-center gap-2 mt-2 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/influencers'><p className='px-4 py-2'>INFLUENCERS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2'>CONTACT</p></NavLink>

            {token ? (
              <p className='px-4 py-2 mt-3 text-red-500'
                onClick={() => { setShowMenu(false); logout(); }}>Logout</p>
            ) : (
              <p className='px-4 py-2 mt-3 text-primary'
                onClick={() => { setShowMenu(false); navigate('/login'); }}>Login</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
