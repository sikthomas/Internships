import React, { useState, useEffect } from 'react';
import { IoMdDoneAll } from "react-icons/io";
import Studentdashboard from './Studentdashboard';
import Header from './Header'; 
import Studentsidebar from './Studentsidebar';
import './Dashboard.css';
import axios from 'axios';

function Studentdshboard({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <Header OpenSidebar={OpenSidebar} />
      {/* Sidebar */}
      <Studentsidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      {/* Main content - pass the content dynamically */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Studentdshboard;
