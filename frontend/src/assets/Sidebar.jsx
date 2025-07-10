import React from 'react'
import { BsFillGrid3X3GapFill, BsPeopleFill,BsBoxes, BsBorderWidth, BsPersonCheck, BsFillRocketTakeoffFill, BsArrowsMove} from 'react-icons/bs'
import { CiLogout } from "react-icons/ci";
import { TiTabsOutline } from "react-icons/ti";
import { Link } from 'react-router-dom';

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                INTERNSHIP PLACE
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
              <Link to="/home">
                    <BsBorderWidth className='icon'/>Admin Dashboard
              </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/users">
                    <BsPeopleFill className='icon'/> Users
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/role">
                    <BsArrowsMove className='icon'/> Assign Role
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <a href="/applicants">
                    <BsFillGrid3X3GapFill className='icon'/> Applications
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/approvedlist">
                    <BsFillGrid3X3GapFill className='icon'/> Approved
                </a>
            </li>

            <li className='sidebar-list-item'>
                <a href="">
                    <BsPersonCheck className='icon'/> Approved
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsFillRocketTakeoffFill className='icon'/> In Progress
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <TiTabsOutline className='icon'/> Completed
                </a>
            </li>
            <li className='sidebar-list-item'>
               <Link to="/logout">
                    <CiLogout className='icon'/> Logout
                </Link>
            </li>
        </ul>
    </aside>
  )
}
export default Sidebar