import React from 'react'
import Navbar from './Navbar';
import  '../Styles/HomePage.css'

const HomePage = () => {
    return (
      <div className="home-page">
        <Navbar />
        <div className="main-content">
          <div className="box">
            <h1>Welcome to the Home Page</h1>
            
            <h3>Developing By Chandhu</h3>
          </div>
        </div>
      </div>
    );
  };
  
  export default HomePage;
