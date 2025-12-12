import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Consultation from './pages/Consultation';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Influencers from './pages/Influencers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import MyProfile from './pages/MyProfile';
import MyConsultations from './pages/MyConsultation';

import { AppContext } from './contex/AppContext';
import NotificationCard from './components/NotificationCard';

const App = () => {
  const { notification, setNotification } = useContext(AppContext);

  return (
    <div>
      {/* ⭐ NEW — Animated Notification Card */}
      {notification.show && (
        <NotificationCard
          type={notification.type}
          message={notification.message}
          onClose={() =>
            setNotification({ show: false, type: 'success', message: '' })
          }
        />
      )}

      <Navbar />

      {/* Container for main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/influencers" element={<Influencers />} />

          {/* Category-based filtering */}
          <Route path="/influencers/:category" element={<Influencers />} />

          <Route path="/my-profile" element={<MyProfile />} />

          {/* Plural fix */}
          <Route path="/my-consultations" element={<MyConsultations />} />

          {/* Consultation Booking */}
          <Route path="/consultation/:infId" element={<Consultation />} />

          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
