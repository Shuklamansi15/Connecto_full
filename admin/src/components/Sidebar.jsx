import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { InfluencerContext } from '../context/InfluencerContext';
import { AdminContext } from '../context/AdminContext';

// ⭐ React Icons
import { FiHome, FiUsers, FiCalendar, FiPlusCircle, FiBarChart2 } from "react-icons/fi";

const Sidebar = () => {
  const { iToken } = useContext(InfluencerContext);
  const { aToken } = useContext(AdminContext);

  // Theme Icon Color
  const iconClass = "min-w-5 text-[#4B49AC] text-xl";

  return (
    <div className='min-h-screen bg-white border-r'>

      {/* ---------------- ADMIN SIDEBAR ---------------- */}
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
            <FiHome className={iconClass} />
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
            <FiCalendar className={iconClass} />
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
            <FiPlusCircle className={iconClass} />
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
            <FiUsers className={iconClass} />
            <p className='hidden md:block'>Influencers List</p>
          </NavLink>

          {/* ⭐ NEW: Influencers Stats */}
          <NavLink
            to='/admin/influencers-stats'
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <FiBarChart2 className={iconClass} />
            <p className='hidden md:block'>Influencers Stats</p>
          </NavLink>

        </ul>
      )}

      {/* ---------------- INFLUENCER SIDEBAR ---------------- */}
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
            <FiHome className={iconClass} />
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
            <FiCalendar className={iconClass} />
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
            <FiUsers className={iconClass} />
            <p className='hidden md:block'>Profile</p>
          </NavLink>

        </ul>
      )}

    </div>
  );
};

export default Sidebar;
