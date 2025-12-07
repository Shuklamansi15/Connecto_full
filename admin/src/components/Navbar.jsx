import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { InfluencerContext } from '../context/InfluencerContext';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { iToken, setIToken } = useContext(InfluencerContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    
    if (iToken) {
      setIToken('');
      localStorage.removeItem('iToken');
    }
    
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }
  };

  return (
    <div className="flex justify-between items-center h-20 px-4 sm:px-10 py-2 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          onClick={() => navigate('/')}
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.logo1}
          alt="Logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? 'Admin' : iToken ? 'Influencer' : 'Guest'}
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;