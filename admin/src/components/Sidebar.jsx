import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { InfluencerContext } from '../context/InfluencerContext';
import { AdminContext } from '../context/AdminContext';

const Sidebar = () => {
  const { iToken } = useContext(InfluencerContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className='min-h-screen bg-white border-r'>

      {/* Admin Sidebar */}
      {aToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            to='/admin-dashboard'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink
            to='/all-consultations'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Consultations</p>
          </NavLink>

          <NavLink
            to='/add-influencer'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p className='hidden md:block'>Add Influencer</p>
          </NavLink>

          <NavLink
            to='/influencer-list'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Influencers List</p>
          </NavLink>
        </ul>
      )}

      {/* Influencer Sidebar */}
      {iToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            to='/influencer-dashboard'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink
            to='/influencer-consultations'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>My Consultations</p>
          </NavLink>

          <NavLink
            to='/influencer-profile'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}

    </div>
  );
};

export default Sidebar;
