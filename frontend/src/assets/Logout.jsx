// LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate replaces useHistory in React Router v6
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate(); // useNavigate for navigation after logout

    const handleLogout = () => {
      const token = localStorage.getItem('auth_token');
      console.log("Token retrieved for logout:", token);  // Log token for debugging
    
      if (!token) {
          alert("No token found. You are still logged in.");
          return;
      }
    
      // Make the logout API call
      axios.post('http://127.0.0.1:8000/api/logout/', {}, {
          headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (response.data.message === "Logged out successfully") {
              localStorage.removeItem('auth_token');  // Clear token from localStorage
              alert("You have logged out successfully.");
              navigate('/login');
          }
      })
      .catch(error => {
          console.error("Error during logout:", error);
          alert("An error occurred while logging out.");
      });
    };
    
  
    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
