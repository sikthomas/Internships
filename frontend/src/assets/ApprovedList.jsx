import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import './ApproveList.css';
import { MdDelete } from 'react-icons/md';

function ApprovedList() {
  const [approvedList, setApprovedList] = useState([]);
  const [aprovedId, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/approvedlist/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      const data = await response.json();
      console.log('Approved List Data:', JSON.stringify(data, null, 2)); // Log for debugging
      setApprovedList(data);
    } catch (err) {
      console.error('Error fetching approved applicants:', err);
    }
  };

  const assignTask = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/assigntask/${aprovedId.id}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assignment_title: assignmentTitle,
            assignment_description: assignmentDescription,
          }),
        }
      );

      if (response.ok) {
        alert('Task assigned successfully.');
        setShowModal(false);
        setAssignmentTitle('');
        setAssignmentDescription('');
        fetchApplicants();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Task assignment failed.');
      }
    } catch (err) {
      console.error('Task assignment error:', err);
      alert('An error occurred during task assignment.');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setAssignmentTitle('');
    setAssignmentDescription('');
  };

  return (
    <Dashboard>
      <h1 className="users-header">Approved Interns</h1>
      <div className="users-table-container">
        {approvedList.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Program</th>
                <th>University</th>
                <th>Application Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedList.map((applicant, index) => (
                <tr key={index}>
                  <td>{applicant.student.first_name}</td>
                  <td>{applicant.student.last_name}</td>
                  <td>{applicant.student.program}</td>
                  <td>{applicant.student.university_name}</td>
                  <td>{new Date(applicant.student.application_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedStudent(applicant);
                        setShowModal(true);
                      }}
                      className="approve-btn"
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#4CAF50',
                      }}
                    >
                      Assign Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No approved interns found.</p>
        )}
      </div>

      {showModal && aprovedId && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setShowModal(false)} className="close-button">
              X
            </button>
            <h2>Assign Task to {aprovedId.student.first_name}</h2>

            <label>Title:</label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="modal-input"
            />

            <label>Description:</label>
            <textarea
              value={assignmentDescription}
              onChange={(e) => setAssignmentDescription(e.target.value)}
              placeholder="Enter assignment description"
              className="modal-textarea"
            />

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                onClick={assignTask}
                className="assign-btn"
                style={{ backgroundColor: '#2196F3' }}
              >
                Submit Task
              </button>
              <button
                onClick={handleCancel}
                className="cancel-btn"
                style={{ backgroundColor: '#ff4444' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}

export default ApprovedList;