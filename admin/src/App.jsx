import React, { useContext } from 'react';
import { InfluencerContext } from './context/InfluencerContext';
import { AdminContext } from "./context/AdminContext";
import { AppContext } from "./context/AppContext";   // ⭐ ADDED
import { Route, Routes, Navigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import InfluencerProfile from './pages/Influencer/InfluencerProfile';
import InfluencersConsultation from './pages/Influencer/InfluencersConsultation';
import InfluencerDashboard from './pages/Influencer/InfluencerDashboard';

// Admin pages
import AllConsultations from './pages/Admin/AllConsultations';
import AddInfluencer from './pages/Admin/AddInfluencer';
import InfluencersList from './pages/Admin/InfluencersList';
import Dashboard from './pages/Admin/Dashboard';

import Login from './pages/Login';
import AdminInfluencerStats from './pages/Admin/AdminInfluencerStats';

import NotificationCard from "./components/NotificationCard"; // ⭐ ADDED

const App = () => {
  const { iToken } = useContext(InfluencerContext);
  const { aToken } = useContext(AdminContext);

  const { notification, hideNotification } = useContext(AppContext); // ⭐ ADDED

  // --------------------------
  // If NO token → show login
  // --------------------------
  if (!iToken && !aToken) {
    return (
      <>
        <ToastContainer />
        <Login />

        {/* ⭐ SHOW NOTIFICATION INSIDE LOGIN PAGE */}
        {notification && (
          <NotificationCard
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
      </>
    );
  }

  return (
    <div className='bg-[#F8F9FD]'>

      {/* <ToastContainer /> */}

      {/* ⭐ GLOBAL NOTIFICATION — works for BOTH Influencer & Admin */}
      {notification && (
        <NotificationCard
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <Navbar />
      <div className='flex items-start'>
        <Sidebar />

        <Routes>

          {/* ------------------------------
              Influencer Routes
          ------------------------------ */}
          {iToken && (
            <>
              <Route path="/" element={<Navigate to="/influencer-dashboard" replace />} />
              <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
              <Route path="/influencer-profile" element={<InfluencerProfile />} />
              <Route path="/influencer-consultations" element={<InfluencersConsultation />} />
            </>
          )}

          {/* ------------------------------
              Admin Routes
          ------------------------------ */}
          {aToken && (
            <>
              <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
              <Route path="/all-consultations" element={<AllConsultations />} />
              <Route path="/add-influencer" element={<AddInfluencer />} />
              <Route path="/influencer-list" element={<InfluencersList />} />
              <Route path="/admin-dashboard" element={<Dashboard />} /> 
              <Route path="/admin/influencers-stats" element={<AdminInfluencerStats />} />
            </>
          )}

          {/* ------------------------------
              Catch-all redirect
          ------------------------------ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
