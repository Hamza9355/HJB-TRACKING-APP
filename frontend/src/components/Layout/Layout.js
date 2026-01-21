import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../App.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} />
      <Box className={`content-wrapper ${!sidebarOpen ? 'collapsed' : ''}`}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
