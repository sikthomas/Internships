import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';  // Import the Dashboard layout
import './Users.css'; // External CSS file for styling
import { MdDelete } from "react-icons/md";

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch("http://127.0.0.1:8000/api/users/", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 401) {
        navigate('/login');
        return;
      }
  
      const data = await response.json();
      setUsers(data); // Set the users data
    } catch (err) {
      console.log('Error fetching users:', err);
    }
  };

  // Function to delete a user with confirmation
  const deleteUser = async (userId) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }
    
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 204) {
          // If user is successfully deleted, remove the user from the UI
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } else {
          console.log('Error deleting user');
        }
      } catch (err) {
        console.log('Error deleting user:', err);
      }
    }
  };

  return (
    <Dashboard>
      {/* Dashboard layout wrapped around Users content */}
      <h1 className="users-header">Users</h1>
      <div className="users-table-container">
        {users.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>University</th>
                <th>Role</th>
                <th>Actions</th> {/* Add a column for actions (Delete button) */}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={user.profile_photo_url} // Use profile_photo_url from the serializer
                      alt="User"
                      className="user-image"
                    />
                  </td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.user_type}</td>
                  <td>{user.university_name}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(user.id)} // Pass the user ID to delete
                      className="delete-button"
                    >
                      <MdDelete style={{ color: 'red', fontSize: '24px' }} /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </Dashboard>
  );
}

export default Users;
