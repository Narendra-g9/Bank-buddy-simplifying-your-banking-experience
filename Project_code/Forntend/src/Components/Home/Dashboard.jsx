import React from 'react';
import Slider from 'react-slick';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import HeroSection from './HeroSection';
import FooterPage from './FooterPage';

const Dashboard = () => {
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite sliding
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Duration between slides in autoplay
    cssEase: 'ease-in-out', // Transition effect
  };

  const images = ['/home1.png', '/home2.png', '/home3.png', '/home4.png'];
  const location = useLocation();

  return (
    <div className="">
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {location.pathname === '/' && (
          <div className="">
            <HeroSection />
          </div>
        )}
        <Outlet />
      </div>
      <FooterPage />
    </div>
  );
};

export default Dashboard;
