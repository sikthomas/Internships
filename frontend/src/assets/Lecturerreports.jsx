import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LecturerDashboard from './LecturerDashboard';
import './Reports.css';

function Lecturerreports() {
  const [reports, setReports] = useState([]);
  const [groupedReports, setGroupedReports] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/getreports/", {
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
      setReports(data);

      const grouped = {};
      data.forEach(report => {
        const studentId = report.student?.id;
        if (studentId) {
          if (!grouped[studentId]) {
            grouped[studentId] = {
              student: report.student,
              reports: [],
            };
          }
          grouped[studentId].reports.push(report);
        }
      });

      setGroupedReports(grouped);
    } catch (err) {
      console.log('Error fetching reports:', err);
    }
  };

  const renderReportTable = (student, reports) => {
    const totalScore = reports.reduce((sum, report) => sum + parseFloat(report.score || 0), 0);
    const averageScore = reports.length > 0 ? (totalScore / reports.length).toFixed(2) : 'N/A';

    return (
      <div key={student.id} className="student-report-section">
        <h3 className="student-name">
          {student.first_name} {student.last_name}
        </h3>
        <p className="average-score">Average Score: <strong>{averageScore}</strong></p>
        <table className="report-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Supervisor Comment</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.assignment_title}</td>
                <td>{report.comment}</td>
                <td>{report.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <LecturerDashboard>
      <div className="report-wrapper">
        {Object.values(groupedReports).map(({ student, reports }) =>
          renderReportTable(student, reports)
        )}
      </div>
    </LecturerDashboard>
  );
}

export default Lecturerreports;
