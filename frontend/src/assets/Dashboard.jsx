import React, { useState } from 'react';
import Header from './Header';  // Ensure correct path and file extension if needed
import Sidebar from './Sidebar'; 
import './Dashboard.css';  // Assuming you have a CSS file for your Dashboard layout

function Dashboard({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <Header OpenSidebar={OpenSidebar} />
      {/* Sidebar */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      {/* Main content - pass the content dynamically */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Dashboard;
