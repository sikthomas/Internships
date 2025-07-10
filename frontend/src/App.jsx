import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import Index from './assets/Index';
import Login from './assets/Login';
import Dashboard from './assets/Dashboard';
import Signup from './assets/Signup';
import './App.css';  // Correct CSS import
import Users from './assets/Users';
import Home from './assets/Home';
import Logout from './assets/Logout';
import Assignrole from './assets/Assignrole';
import Studentdashboard from './assets/Studentdashboard';
import Studenthome from './assets/Studenthome';
import ApplicantList from './assets/ApplicantList';
import ApplicationForm from './assets/ApplicationForm';
import PasswordResetRequest from './assets/PasswordResetRequest';
import ApprovedList from './assets/ApprovedList';

function App() {
  return (
    <Router>
      <Routes>  {/* Use Routes instead of Switch */}
        {/* Use element prop and pass JSX */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users/>} />
        <Route path="/applicationform" element={<ApplicationForm/>} />
        <Route path="/applicants" element={<ApplicantList/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/role" element={< Assignrole/>} />
        <Route path="/studentdashboard" element={< Studentdashboard/>} />
        <Route path="/studenthome" element={< Studenthome/>} />
        <Route path="/approvedlist" element={< ApprovedList/>} />
        <Route path="/" element={<Index/>} />
        <Route path="/passwordreset" element={<PasswordResetRequest/>} />
      </Routes>
    </Router>
  );
}
export default App;

