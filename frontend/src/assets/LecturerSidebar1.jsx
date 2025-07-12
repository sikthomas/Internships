import React from 'react'
import { BsFillGrid3X3GapFill, BsPeopleFill,BsBoxes, BsBorderWidth, BsPersonCheck, BsFillRocketTakeoffFill, BsArrowsMove} from 'react-icons/bs'
import { CiLogout } from "react-icons/ci";
import { TiTabsOutline } from "react-icons/ti";
import { Link } from 'react-router-dom';

function LecturerSidebar({openSidebarToggle, OpenSidebar}) {
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
              <Link to="/home1">
                    <BsBorderWidth className='icon'/>Lecturer Dashboard
              </Link>
            </li>

            <li className='sidebar-list-item'>
               <Link to="/">
                    <CiLogout className='icon'/> Logout
                </Link>
            </li>
        </ul>
    </aside>
  )
}
export default LecturerSidebar