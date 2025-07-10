import React, { useState, useEffect } from 'react';
import './Assignrole.css';  // You can style it as you prefer
import Select from 'react-select';
import Dashboard from './Dashboard';  // Ensure this is the correct import for your dashboard component
import { useNavigate } from 'react-router-dom';  // Add this for navigation

const Assignrole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [userErrorMessage, setUserErrorMessage] = useState('');
  const [roleErrorMessage, setRoleErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Fetch users and roles from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users_list/');  // Correct endpoint for users
        if (!response.ok) {
          throw new Error('Error fetching users');
        }
        const data = await response.json();
        const usersOptions = data.map(user => ({
          value: user.id,
          label: `${user.first_name} ${user.last_name} (${user.email})`,  
        }));
        setUsers(usersOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/roles_choices/');  // Correct endpoint for roles
        if (!response.ok) {
          throw new Error('Error fetching roles');
        }
        const data = await response.json();
        // Map roles to match Select input structure
        const rolesOptions = data.map(role => ({
          value: role.id,  // Assuming roles have 'id' and 'name' properties
          label: role.name,
        }));
        setRoles(rolesOptions);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error messages
    setUserErrorMessage('');
    setRoleErrorMessage('');
    setErrorMessage('');
    setSuccessMessage('');

    // Validation before submitting the form
    if (!selectedUser) {
      setUserErrorMessage('Please select a user.');
      return;
    }

    if (!selectedRole) {
      setRoleErrorMessage('Please select a role.');
      return;
    }

    // Get the token from localStorage (ensure correct key name)
    const token = localStorage.getItem('authToken');  // <-- Use 'authToken' here

    if (!token) {
      setErrorMessage('You are not logged in. Please log in to proceed.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/assign-role/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Use the token in the request header
        },
        body: JSON.stringify({
          user_id: selectedUser.value,
          role: selectedRole.value,  // Send role's value to backend
        }),
      });

      if (response.ok) {
        setSuccessMessage('Role assigned successfully!');
        setErrorMessage('');
        // Navigate to another page (like Dashboard) after successful assignment
        navigate('/home');  // Ensure this redirects properly to your desired page
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Error assigning role.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Failed to submit form. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Dashboard> {/* Ensure Dashboard is the correct parent component */}
      <div className="assign-role-form">
        <h2>Assign Role</h2>

        <form onSubmit={handleSubmit}>
          {/* User Selection */}
          <div className="form-group">
            <label htmlFor="user-select">Select User:</label>
            <Select
              id="user-select"
              options={users}
              onChange={setSelectedUser}
              value={selectedUser}
              placeholder="Select a user"
              isClearable
            />
            {userErrorMessage && <div className="error-message">{userErrorMessage}</div>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role-select">Select Role:</label>
            <Select
              id="role-select"
              options={roles}
              onChange={setSelectedRole}
              value={selectedRole}
              placeholder="Select a role"
              isClearable
            />
            {roleErrorMessage && <div className="error-message">{roleErrorMessage}</div>}
          </div>

          {/* Error & Success Messages */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          {/* Submit Button */}
          <div className="form-group">
            <button type="submit" className="submit-button">Assign Role</button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default Assignrole;
