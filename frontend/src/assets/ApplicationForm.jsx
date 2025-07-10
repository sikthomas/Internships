import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationForm.css';
import Studentdashboard from './Studentdashboard';

const ApplicationForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [education, setEducation] = useState('');
  const [course, setCourse] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [program, setProgram] = useState('');
  const [studentCv, setStudentCv] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [educationError, setEducationError] = useState('');
  const [courseError, setCourseError] = useState('');
  const [fileError, setFileError] = useState('');
  const [idnumberError, setIdNumberError] = useState('');
  const [phonenumberError, setPhoneNumberError] = useState('');
  const [registrationnumberError, setRegistrationNumberError] = useState('');
  const [programError, setProgramError] = useState('');

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const checkExistingApplication = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMessage('You are not logged in. Please log in to proceed.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/apply_internship/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setIsUpdateMode(true);
          setIdNumber(data.idnumber);
          setPhoneNumber(data.phonenumber);
          setEducation(data.education);
          setCourse(data.course);
          setRegistrationNumber(data.registration_number);
          setProgram(data.program);
        }
      } else {
        setIsUpdateMode(false);
        setErrorMessage('No existing application found. You can submit a new application.');
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      setErrorMessage('An error occurred while fetching application data.');
    }
  };

  const handleFileChange = (e) => {
    setStudentCv(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    setEducationError('');
    setCourseError('');
    setFileError('');
    setProgramError('');
    setRegistrationNumberError('');
    setIdNumberError('');
    setPhoneNumberError('');

    if (!education) setEducationError('Education is required');
    if (!course) setCourseError('Course is required');
    if (!program) setProgramError('Program is required');
    if (!idNumber) setIdNumberError('ID number required');
    if (!phoneNumber) setPhoneNumberError('Phone number required');
    if (!registrationNumber) setRegistrationNumberError('Registration number required');

    if (education && course && program && idNumber && phoneNumber && registrationNumber) {
      const formData = new FormData();
      formData.append('idnumber', idNumber);
      formData.append('phonenumber', phoneNumber);
      formData.append('education', education);
      formData.append('course', course);
      formData.append('registration_number', registrationNumber);
      formData.append('program', program);
      if (studentCv) {
        formData.append('student_cv', studentCv);
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrorMessage('You are not logged in. Please log in to proceed.');
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/apply_internship/', {
          method: isUpdateMode ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(isUpdateMode ? 'Application updated successfully!' : 'Application submitted successfully!');
          setTimeout(() => navigate('/studenthome'), 1500);
        } else {
          setErrorMessage(data.detail || 'An error occurred during submission.');
        }
      } catch (error) {
        setErrorMessage('Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <Studentdashboard>
      <div className="appform-container">
        <div className="appform-card">
          <h1 className="appform-title">
            {isUpdateMode ? 'UPDATE APPLICATION FORM' : 'APPLICATION FORM'}
          </h1>

          <div className="appform-input">
            <input
              value={idNumber}
              placeholder="Enter your ID number"
              onChange={(ev) => setIdNumber(ev.target.value)}
              className="appform-inputbox"
            />
            {idnumberError && <div className="appform-error">{idnumberError}</div>}
          </div>

          <div className="appform-input">
            <input
              value={phoneNumber}
              placeholder="Enter your phone number"
              onChange={(ev) => setPhoneNumber(ev.target.value)}
              className="appform-inputbox"
            />
            {phonenumberError && <div className="appform-error">{phonenumberError}</div>}
          </div>

          <div className="appform-input">
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="appform-inputbox"
            >
              <option value="">Select Education</option>
              <option value="Degree">Degree</option>
              <option value="Diploma">Diploma</option>
            </select>
            {educationError && <div className="appform-error">{educationError}</div>}
          </div>

          <div className="appform-input">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="appform-inputbox"
            >
              <option value="">Select Course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
            {courseError && <div className="appform-error">{courseError}</div>}
          </div>

          <div className="appform-input">
            <input
              value={registrationNumber}
              placeholder="Enter your registration number"
              onChange={(ev) => setRegistrationNumber(ev.target.value)}
              className="appform-inputbox"
            />
            {registrationnumberError && <div className="appform-error">{registrationnumberError}</div>}
          </div>

          <div className="appform-input">
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="appform-inputbox"
            >
              <option value="">Select Program</option>
              <option value="Application Development">Application Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Technical Support">Technical Support</option>
              <option value="DevOps">DevOps</option>
            </select>
            {programError && <div className="appform-error">{programError}</div>}
          </div>

          <div className="appform-input">
            <input type="file" onChange={handleFileChange} className="appform-inputbox" />
            {fileError && <div className="appform-error">{fileError}</div>}
          </div>

          {successMessage && <div className="appform-success">{successMessage}</div>}
          {errorMessage && <div className="appform-error">{errorMessage}</div>}
          {isSubmitting && <div className="appform-loading">Submitting...</div>}

          <div className="appform-input">
            <input
              className="appform-button"
              type="button"
              onClick={handleSubmit}
              value={isSubmitting ? 'Submitting...' : isUpdateMode ? 'Update Application' : 'Submit Application'}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Studentdashboard>
  );
};

export default ApplicationForm;
