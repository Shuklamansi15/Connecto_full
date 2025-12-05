import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Consultation from './pages/Consultation';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Influencers from './pages/Influencers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyProfile from './pages/MyProfile';
import MyConsultations from './pages/MyConsultation';

const App = () => {
  return (
    // FIX 2: Apply a better outer container for max width and centering
    // The original margin classes (mx-4 sm:mx-[10%]) are removed from here
    <div>
      <ToastContainer/>
      
      <Navbar />
      
      {/* Container for main content, using the original margin classes here for consistency */}
      <div className='max-w-7xl mx-auto px-4 sm:px-8'> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/influencers' element={<Influencers />} />
          {/* Category-based filtering route for influencers */}
          <Route path='/influencers/:category' element={<Influencers />} />
          
          <Route path='/my-profile' element={<MyProfile />} />
          
          {/* FIX 3: Updated path and element to plural 'my-consultations' / <MyConsultations /> */}
          <Route path='/my-consultations' element={<MyConsultations />} /> 
          {/* Specific influencer consultation booking page */}
          <Route path='/consultation/:infId' element={<Consultation />} />
          
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </div>
      
      <Footer/>
    </div>
  );
};

export default App;