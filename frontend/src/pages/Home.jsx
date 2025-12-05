import React from 'react';
// FIX 1: Remove unnecessary 'Component' import
// import { Component } from 'react'; 
import Header from '../components/Header';

// FIX 2 & 3: Update imports to use the fixed names
import CategoryMenu from '../components/CategoryMenu'; 
import TopInfluencers from '../components/TopInfluencers'; 

import Banner from '../components/Banner';

// FIX 4: Ensure the component is correctly defined as a functional component
const Home = () => {
  return (
    <div>
       <Header/>
       <CategoryMenu/>
       <TopInfluencers/>
       <Banner/>
    </div>
  );
};

export default Home;