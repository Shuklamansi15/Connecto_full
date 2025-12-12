import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../contex/AppContext';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'INFLUENCERS', path: '/influencers' },
  { label: 'ABOUT', path: '/about' },
  { label: 'CONTACT', path: '/contact' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/influencers?search=${searchInput}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="flex items-center justify-between py-4 px-4 sm:px-8 lg:px-12 h-20 border-b border-gray-100 sticky top-0 bg-white z-50 transition-all">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center">
        <img
          onClick={() => navigate('/')}
          src={assets.logo1}
          alt="Brand Logo"
          className="h-9 sm:h-11 cursor-pointer hover:opacity-80 transition-opacity duration-300"
        />
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 lg:gap-10 font-medium text-gray-600">
        {NAV_LINKS.map((link) => {
          const hideOnTablet = (link.label === 'ABOUT' || link.label === 'CONTACT') ? 'hidden md:hidden lg:flex' : '';
          return (
            <NavLink key={link.label} to={link.path}>
              {({ isActive }) => (
                <li
                  className={`group relative pb-1.5 transition-colors duration-300 ${isActive ? 'text-[#1999d5]' : 'hover:text-black'} ${hideOnTablet}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#1999d5] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </li>
              )}
            </NavLink>
          );
        })}
      </ul>

      {/* Search Bar */}
      <div className="hidden sm:block flex-1 max-w-lg mx-6 lg:mx-10">
        <SearchBar className="w-10 h-11 shadow-sm" />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {!token && (
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:block bg-[#1999d5] text-white px-7 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg hover:bg-[#1588c0] transition-all active:scale-95"
          >
            Sign In
          </button>
        )}

        {token && userData && (
          <div className="relative group p-1">
            <div className="rounded-full border-2 border-transparent group-hover:border-[#1999d5] transition-all duration-300 p-0.5">
              <img
                src={userData.image || assets.avatar_placeholder}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover shadow hover:shadow-md transition-shadow ring-2 ring-white"
              />
            </div>

            <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="min-w-60 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">My Account</p>
                </div>
                <div
                  onClick={() => navigate('/my-profile')}
                  className="px-4 py-3.5 text-sm font-medium hover:bg-gray-50 hover:text-[#1999d5] transition-colors cursor-pointer"
                >
                  My Profile
                </div>
                <div
                  onClick={() => navigate('/my-consultations')}
                  className="px-4 py-3.5 text-sm font-medium hover:bg-gray-50 hover:text-[#1999d5] transition-colors cursor-pointer"
                >
                  My Consultations
                </div>
                <hr className="border-gray-50" />
                <div
                  onClick={logout}
                  className="px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1 relative z-50"
        >
          <span className={`block h-0.5 w-7 bg-gray-600 rounded transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-7 bg-gray-600 rounded transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block h-0.5 w-7 bg-gray-600 rounded transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[40] flex flex-col transition-all duration-500">
          <div className="px-6 pt-8">
            <form 
              onSubmit={handleSearch} 
              className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus-within:ring-2 ring-[#1999d5]/20 focus-within:border-[#1999d5] transition-all"
            >
              <input
                type="text"
                placeholder="Search influencers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-base font-medium"
              />
              <button type="submit" className="p-1">
                <img src={assets.search_icon} alt="Search" className="w-5 opacity-50" />
              </button>
            </form>
          </div>

          <ul className="flex flex-col mt-10 px-6 gap-2">
            {NAV_LINKS.map((link) => {
              const hideOnTablet = (link.label === 'ABOUT' || link.label === 'CONTACT') ? 'hidden md:hidden lg:flex' : '';
              return (
                <NavLink
                  key={link.label}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-4 px-6 text-xl font-bold rounded-2xl transition-all ${hideOnTablet} ${
                      isActive 
                        ? 'bg-[#1999d5] text-white shadow-lg shadow-[#1999d5]/20' 
                        : 'text-gray-600 active:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </ul>

          <div className="mt-auto p-6 border-t border-gray-50">
            {token ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full py-4.5 bg-red-500 text-white rounded-2xl font-black shadow-lg active:scale-[0.98] transition-all"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false); }}
                className="w-full py-4.5 bg-[#1999d5] text-white rounded-2xl font-black shadow-lg shadow-[#1999d5]/25 active:scale-[0.98] transition-all"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
