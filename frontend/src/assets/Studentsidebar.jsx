import React, { useState, useEffect } from 'react';
import { BsFillGrid3X3GapFill, BsPeopleFill, BsBoxes, BsBorderWidth, BsArrowsMove, BsPersonCheck } from 'react-icons/bs';
import { CiLogout } from "react-icons/ci";
import { Link } from 'react-router-dom';

function Studentsidebar({ openSidebarToggle, OpenSidebar }) {
    const [applicationExists, setApplicationExists] = useState(null);

    // Fetch application status to check if it exists
    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/apply_internship/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include the token in the header
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplicationExists(true); // Application exists
                } else if (response.status === 404) {
                    setApplicationExists(false); // Application does not exist
                } else {
                    console.error('Failed to fetch application status');
                }
            } catch (error) {
                console.error('Error fetching application status:', error);
            }
        };

        checkApplicationStatus();
    }, []); // Run once when the component mounts

    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                     INTERNSHIPS
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to="/studenthome">
                        <BsBorderWidth className='icon' />Dashboard
                    </Link>
                </li>

                {/* Conditional rendering based on application existence */}
                <li className='sidebar-list-item'>
                    {applicationExists === null ? (
                        <span>Loading...</span> // Show loading while checking the application status
                    ) : applicationExists ? (
                        <Link to="/applicationform">
                            <BsPeopleFill className='icon' /> Update
                        </Link>
                    ) : (
                        <Link to="/applicationform">
                            <BsPeopleFill className='icon' /> Apply
                        </Link>
                    )}
                </li>

                <li className='sidebar-list-item'>
                    <Link to="">
                        <BsArrowsMove className='icon' /> Status
                    </Link>
                </li>

                <li className='sidebar-list-item'>
                    <a href="/studentreports">
                        <BsPersonCheck className='icon'/> Report
                    </a>
                </li>

                <li className='sidebar-list-item'>
                    <Link to="/">
                        <CiLogout className='icon' /> Logout
                    </Link>
                </li>
            </ul>
        </aside>
    );
}

export default Studentsidebar;
