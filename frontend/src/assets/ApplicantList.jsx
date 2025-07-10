import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard'; 
import './Users.css'; // External CSS file for styling
import { MdDelete } from 'react-icons/md'; // Assuming you're using this icon

function ApplicantList() {
  const [applicants, setApplicants] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);  // State to hold selected student details
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
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

      const response = await fetch("http://127.0.0.1:8000/api/applicants_list/", {
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
      setApplicants(data); // Set the applicants data
    } catch (err) {
      console.log('Error fetching applicants:', err);
    }
  };

  const viewStudentDetails = async (studentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:8000/api/applicant_detail/${studentId}/`, {
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
      setSelectedStudent(data);
      setShowModal(true); // Show the modal
    } catch (err) {
      console.log('Error fetching student details:', err);
    }
  };

  const handleApprove = async (applicantId) => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/approvestudent/${applicantId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'approved'
      })
    });

    if (response.ok) {
      alert('Applicant approved successfully.');
      // Optionally refresh the list or remove the approved applicant from state
      fetchApplicants();
    } else {
      const errorData = await response.json();
      alert(errorData.detail || 'Approval failed.');
    }
  } catch (err) {
    console.error('Approval error:', err);
    alert('An error occurred during approval.');
  }
};


  return (
    <Dashboard>
      {/* Dashboard layout wrapped around Users content */}
      <h1 className="users-header">Applicants</h1>
      <div className="users-table-container">
        {applicants.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Program Applied</th>
                <th>University</th>
                <th>Application Date</th>
                <th>Actions</th> {/* Add a column for actions */}
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={applicant.student_id.profile_photo_url} // Use profile_photo_url from the serializer
                      alt="User"
                      className="user-image"
                    />
                  </td>
                  <td>{applicant.student_id.first_name}</td>
                  <td>{applicant.student_id.last_name}</td>
                  <td>{applicant.program}</td>
                  <td>{applicant.student_id.university_name}</td>
                  <td>{applicant.application_date}</td>
                  <td>
                  <button
                    onClick={() => viewStudentDetails(applicant.student_id.id)} // Fetch details by student ID
                    className="view-more-btn" // Custom styled button
                    >
                    View More Info
                    </button>
                  </td>

                  <td>
                  <button
                    onClick={() => handleApprove(applicant.id)}
                    className="approve-btn"
                    style={{
                      marginLeft: '10px',
                      backgroundColor: applicant.is_approved ? '#ccc' : '#4CAF50',
                      color: 'white',
                      cursor: applicant.is_approved ? 'not-allowed' : 'pointer'
                    }}
                    disabled={applicant.is_approved}
                  >
                    {applicant.is_approved ? 'Approved' : 'Approve'}
                  </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No applicants found</p>
        )}
      </div>

{showModal && selectedStudent && (
  <div className="modal">
    <div className="modal-content">
      {/* Close the modal by clicking the X or the Cancel button */}
      <button onClick={() => setShowModal(false)} className="close-button">X</button>
      
      {/* Additional Exit button for canceling */}
      <button onClick={() => setShowModal(false)} className="exit-button">Exit</button>

      {/* Student Info Section */}
      <div className="student-info">
        <img
          src={selectedStudent.student_id.profile_photo_url}
          alt="Profile"
          className="student-image"
        />
        <div className="student-details">
          <div><strong>First Name:</strong> {selectedStudent.student_id.first_name}</div>
          <div><strong>Last Name:</strong> {selectedStudent.student_id.last_name}</div>
          <div><strong>Email:</strong> {selectedStudent.student_id.email}</div>
          <div><strong>University:</strong> {selectedStudent.student_id.university_name}</div>
          <div><strong>Program:</strong> {selectedStudent.program}</div>
          <div><strong>Education Level:</strong> {selectedStudent.education}</div>
          <div><strong>Course:</strong> {selectedStudent.course}</div>
          <div><strong>Registration Number:</strong> {selectedStudent.registration_number}</div>
          <div><strong>Phone Number:</strong> {selectedStudent.phonenumber}</div>
          <div><strong>ID Number:</strong> {selectedStudent.idnumber}</div>
          <div><strong>CV:</strong>
            <a href={selectedStudent.student_cv_url} target="_blank" rel="noopener noreferrer">Download CV</a>
            </div>
          <div><strong>Application Date:</strong> {selectedStudent.application_date}</div>
        </div>
      </div>
    </div>
  </div>
)}

    </Dashboard>
  );
}

export default ApplicantList;
