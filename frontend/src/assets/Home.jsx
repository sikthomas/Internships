import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Studentdashboard from './Studentdashboard';
import './Home.css';
import Dashboard from './Dashboard';

function Home() {
  const [assignments, setAssignments] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ratingAssignmentId, setRatingAssignmentId] = useState(null);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingScore, setRatingScore] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/assignedtasks/", {
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
      setAssignments(data);
      fetchAllCommentCounts(data, token);
    } catch (err) {
      console.log('Error fetching assignments:', err);
    }
  };

  const fetchAllCommentCounts = async (assignments, token) => {
    try {
      const counts = {};
      for (const assignment of assignments) {
        const res = await fetch(`http://127.0.0.1:8000/api/viewcomment/?assignment_id=${assignment.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        counts[assignment.id] = data.length;
      }
      setCommentCounts(counts);
    } catch (error) {
      console.error('Error fetching comment counts:', error);
    }
  };

  const toggleComments = async (assignmentId) => {
    const isVisible = visibleComments[assignmentId];
    if (isVisible) {
      setVisibleComments(prev => ({ ...prev, [assignmentId]: false }));
    } else {
      if (!comments[assignmentId]) {
        await fetchComments(assignmentId);
      }
      setVisibleComments(prev => ({ ...prev, [assignmentId]: true }));
    }
  };

  const fetchComments = async (assignmentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:8000/api/viewcomment/?assignment_id=${assignmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setComments(prev => ({ ...prev, [assignmentId]: data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentChange = (assignmentId, value) => {
    setNewComment(prev => ({ ...prev, [assignmentId]: value }));
  };

  const sendComment = async (assignmentId) => {
    const token = localStorage.getItem('authToken');
    const comment = newComment[assignmentId];
    if (!comment) return;

    const response = await fetch('http://127.0.0.1:8000/api/sendcomment/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment, assignmentId })
    });

    if (response.ok) {
      setNewComment(prev => ({ ...prev, [assignmentId]: '' }));
      await fetchComments(assignmentId);
      setCommentCounts(prev => ({ ...prev, [assignmentId]: (prev[assignmentId] || 0) + 1 }));
    }
  };

  const submitRating = async () => {
    if (!ratingAssignmentId || !ratingComment || ratingScore === '') return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/api/postreport/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId: ratingAssignmentId,
          comment: ratingComment,
          score: parseInt(ratingScore)
        })
      });

      if (response.ok) {
        setShowModal(false);
        setRatingComment('');
        setRatingScore('');
        setRatingAssignmentId(null);
        alert('Report submitted successfully!');
        fetchAssignments();
      } else {
        alert('Failed to submit report.');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  return (
    <Dashboard>
      <h1 className="mb-4">Assignments</h1>

      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={() => { setSearchQuery(''); setStartDate(''); setEndDate(''); }}>
          Reset
        </button>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="d-flex flex-wrap justify-content-center">
            {assignments
              .filter((assignment) => {
                const fullName = `${assignment.student.first_name} ${assignment.student.last_name}`.toLowerCase();
                const matchesName = fullName.includes(searchQuery);
                const date = new Date(assignment.assigned_date);
                const afterStart = startDate ? new Date(startDate) <= date : true;
                const beforeEnd = endDate ? date <= new Date(endDate) : true;
                return matchesName && afterStart && beforeEnd;
              })
              .map((assignment, index) => (
                <div key={index} className="card-wrapper mx-auto">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center">
                          <img src={assignment.supervisor.profile_photo_url} alt="supervisor" className="user-avatar me-2" />
                          <strong>
                            Student | {assignment.student.first_name} {assignment.student.last_name} | {assignment.assigned_date}
                          </strong>
                        </div>
                        <small className="assignment-date">{assignment.assigned_date}</small>
                      </div>

                      <div className="mt-2 ms-4">
                        <div className="assignment-title">{assignment.assignment_title}</div>
                        <div className="assignment-description">{assignment.assignment_description}</div>
                      </div>

                      {commentCounts[assignment.id] > 0 && (
                        <div className="mt-3">
                          <button className="btn btn-link p-0" onClick={() => toggleComments(assignment.id)}>
                            {visibleComments[assignment.id] ? 'Hide Responses' : 'Responses'} (
                              <span style={{ color: commentCounts[assignment.id] > 0 ? 'red' : 'inherit' }}>
                                {commentCounts[assignment.id]}
                              </span>
                            )
                          </button>
                        </div>
                      )}

                      {visibleComments[assignment.id] && (
                        <div className="mt-3 border-top pt-2">
                          {(comments[assignment.id] || []).map((c, idx) => (
                            <div key={idx} className="comment-wrapper">
                              <div className="comment-user">
                                <img src={c.commented_by.profile_photo_url} alt="user" />
                                <strong>{c.commented_by.first_name} {c.commented_by.last_name}</strong>
                                <small className="ms-2 text-muted">{new Date(c.commented_at).toLocaleString()}</small>
                              </div>
                              <div className="comment-text">{c.comment}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!assignment.is_rated ? (
                        <div className="mt-3 comment-input-wrapper">
                          <textarea
                            className="form-control comment-textarea"
                            rows="2"
                            placeholder="Write a comment..."
                            value={newComment[assignment.id] || ''}
                            onChange={(e) => handleCommentChange(assignment.id, e.target.value)}
                          />
                          <div className="d-flex align-items-center mt-2">
                            <button className="send-comment-btn" onClick={() => sendComment(assignment.id)}>
                              Send
                            </button>
                            <button
                              className="rate-assignment-btn"
                              onClick={() => {
                                setRatingAssignmentId(assignment.id);
                                setShowModal(true);
                              }}
                            >
                              Rate Assignment
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 text-success" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                          ✅ This assignment has already been rated.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {assignments.length === 0 && <p>No assignments found.</p>}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h4>Rate Assignment</h4>
            <textarea
              placeholder="Enter your comment"
              rows={3}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />
            <input
              type="number"
              placeholder="Score (0–100)"
              min={0}
              max={100}
              value={ratingScore}
              onChange={(e) => setRatingScore(e.target.value)}
            />
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={submitRating}>Submit Rating</button>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}

export default Home;