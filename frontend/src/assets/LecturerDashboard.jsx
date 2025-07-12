import React, { useState } from 'react';
import Header from './Header'; 
import './Dashboard.css';  
import LecturerSidebar from './LecturerSidebar1';

function LecturerDashboard({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <Header OpenSidebar={OpenSidebar} />
      {/* Sidebar */}
      <LecturerSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      {/* Main content - pass the content dynamically */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default LecturerDashboard;
