import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usertype, setUsertype] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userTypeError, setUserTypeError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // Reset error messages
    setFirstNameError('');
    setLastNameError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setUserTypeError('');
    setErrorMessage('');

    // Validation
    if (!firstName) setFirstNameError('First name is required');
    if (!lastName) setLastNameError('Last name is required');
    if (!username) setUsernameError('Username is required');
    if (!email) setEmailError('Email is required');
    if (!password) setPasswordError('Password is required');
    if (!usertype) setUserTypeError('User type is required');
    if (!university) setErrorMessage('University is required');

    if (firstName && lastName && username && email && password && usertype && university) {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('user_type', usertype);
      formData.append('university_name', university);
      formData.append('password', password);
      if (image) {
        formData.append('profile_photo', image);
      }

      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/signup/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          navigate('/login');
        } else {
          setErrorMessage(data.detail || 'An error occurred during registration.');
        }
      } catch (error) {
        setErrorMessage('Failed to submit form. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="mainContainer">
      <div className="formContainer">
        <div className="imageContainer">
          <img src="/images/signup.png" alt="Signup" className="signupImage" />
        </div>

        <div className="formFields">
          <div className="titleContainer">
            <h1>Signup</h1>
          </div>

          {/* First Name */}
          <div className="inputContainer">
            <input
              value={firstName}
              placeholder="Enter your first name"
              onChange={(ev) => setFirstName(ev.target.value)}
              className="inputBox"
            />
            {firstNameError && <div className="errorLabel">{firstNameError}</div>}
          </div>

          {/* Last Name */}
          <div className="inputContainer">
            <input
              value={lastName}
              placeholder="Enter your last name"
              onChange={(ev) => setLastName(ev.target.value)}
              className="inputBox"
            />
            {lastNameError && <div className="errorLabel">{lastNameError}</div>}
          </div>

          {/* Username */}
          <div className="inputContainer">
            <input
              value={username}
              placeholder="Enter your username"
              onChange={(ev) => setUsername(ev.target.value)}
              className="inputBox"
            />
            {usernameError && <div className="errorLabel">{usernameError}</div>}
          </div>

          {/* Email */}
          <div className="inputContainer">
            <input
              value={email}
              placeholder="Enter your email"
              onChange={(ev) => setEmail(ev.target.value)}
              className="inputBox"
            />
            {emailError && <div className="errorLabel">{emailError}</div>}
          </div>

          {/* Password */}
          <div className="inputContainer">
            <input
              value={password}
              type="password"
              placeholder="Enter your password"
              onChange={(ev) => setPassword(ev.target.value)}
              className="inputBox"
            />
            {passwordError && <div className="errorLabel">{passwordError}</div>}
          </div>

          {/* User Type */}
          <div className="inputContainer">
            <select
              value={usertype}
              onChange={(e) => setUsertype(e.target.value)}
              className="inputBox"
            >
              <option value="">Select user type</option>
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
              <option value="lecturer">Lecturer</option>
            </select>
            {userTypeError && <div className="errorLabel">{userTypeError}</div>}
          </div>

          {/* University */}
          <div className="inputContainer">
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="inputBox"
            >
              <option value="">Select university</option>
              <option value="Kabianga">Kabianga</option>
              <option value="University of Nairobi">University of Nairobi</option>
              <option value="Kabarak University">Kabarak University</option>
            </select>
            {errorMessage && !university && <div className="errorLabel">{errorMessage}</div>}
          </div>

          {/* Profile Photo */}
          <div className="inputContainer">
            <input
              type="file"
              onChange={handleImageChange}
              className="inputBox"
            />
          </div>

          {/* General Error */}
          {errorMessage && university && <div className="errorLabel">{errorMessage}</div>}

          {/* Submit Button + Spinner */}
          <div className="inputContainer">
            <input
              className="inputButton"
              type="button"
              onClick={handleSubmit}
              value={loading ? "Submitting..." : "Signup"}
              disabled={loading}
            />
            {loading && <div className="spinner"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
