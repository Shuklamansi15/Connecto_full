import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AdminContextProvider from './context/AdminContext.jsx';
import InfluencerContextProvider from './context/InfluencerContext.jsx';
import AppContextProvider from './context/AppContext.jsx';
import axios from 'axios';

// Automatically attach tokens to axios
axios.interceptors.request.use((config) => {
  const iToken = localStorage.getItem('iToken');
  const aToken = localStorage.getItem('aToken');

  if (config.url.includes('/api/influencer') && iToken) {
    config.headers.Authorization = `Bearer ${iToken}`;
  }

  if (config.url.includes('/api/admin') && aToken) {
    config.headers.Authorization = `Bearer ${aToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <InfluencerContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </InfluencerContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
