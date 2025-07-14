
import React, { useState, useEffect } from 'react';
import { IoMdDoneAll } from "react-icons/io";
import Studentdashboard from './Studentdashboard';
import { useNavigate } from 'react-router-dom';
import './Studenthome.css';

function Studenthome() {
  const [assignments, setAssignments] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComment, setNewComment] = useState({});
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
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  return (
    <Studentdashboard>
      <h1 className="mb-4">Assignments</h1>
      <div className="container">
        <div className="row justify-content-center">
          <div className="d-flex flex-wrap justify-content-center">
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <div key={index} className="card-wrapper mx-auto">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center">
                          <img src={assignment.supervisor.profile_photo_url} alt="supervisor" className="user-avatar me-2" />
                          <strong>Supervisor | {assignment.supervisor.first_name} {assignment.supervisor.last_name}</strong>
                        </div>
                        <small className="assignment-date">{assignment.assigned_date}</small>
                      </div>

                      <div className="mt-2 ms-4">
                        <div className="assignment-title">{assignment.assignment_title}</div>
                        <div className="assignment-description">{assignment.assignment_description}</div>
                      </div>

                      {assignment.is_rated ? (
                       <div className="mt-3 text-success fw-bold d-flex align-items-center">
                        <input type="checkbox" checked readOnly className="form-check-input me-2" />
                        <em>This assignment is rated</em>
                      </div>
                      ) : (
                        <>
                          {/* Load Comments Button */}
                          {commentCounts[assignment.id] > 0 && (
                            <div className="mt-3">
                              <button
                                className="btn btn-link p-0"
                                onClick={() => toggleComments(assignment.id)}
                              >
                                {visibleComments[assignment.id] ? 'Hide Responses' : 'Responses'} (
                                <span style={{ color: commentCounts[assignment.id] > 0 ? 'red' : 'inherit' }}>
                                  {commentCounts[assignment.id]}
                                </span>
                                )
                              </button>
                            </div>
                          )}

                          {/* Comments List */}
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

                          {/* Comment Input */}
                          <div className="mt-3 comment-input-wrapper">
                            <textarea
                              className="form-control comment-textarea"
                              rows="2"
                              placeholder="Write a Response..."
                              value={newComment[assignment.id] || ''}
                              onChange={(e) => handleCommentChange(assignment.id, e.target.value)}
                            />
                            <button
                              className="send-comment-btn"
                              onClick={() => sendComment(assignment.id)}
                            >
                              Send
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No assignments found.</p>
            )}
          </div>
        </div>
      </div>
    </Studentdashboard>
  );
}

export default Studenthome;