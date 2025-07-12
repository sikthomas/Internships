import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css'; // Ensure this file exists and has the styles mentioned

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onButtonClick = async () => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!email) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
    }

    if (!password) {
      setPasswordError('Password is required');
    }

    if (!email || !password || !emailRegex.test(email)) return;

    setLoading(true); // Start loading spinner

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if (data.detail) {
          if (data.detail.includes("Email does not exist")) {
            setEmailError('Email does not exist. Please check your email address.');
          } else if (data.detail.includes("Incorrect password")) {
            setPasswordError('Incorrect password. Please try again.');
          } else {
            setErrorMessage('An error occurred. Please try again later.');
          }
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
        return;
      }

      const data = await response.json();

      if (data.access && data.refresh) {
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        const userType = data.user.user_type;

        if (userType === 'student') {
          navigate('/studenthome');
        } else if(userType === 'supervisor'){
          navigate('/home');
        }
        else{
          navigate('/home1');
        }
      } else {
        setErrorMessage('Invalid response from server. No tokens found.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="loginMainContainer">
      <div className="loginFormContainer">
        {/* Left Section for Image */}
        <div className="imageContainer">
          <img src="/images/login.png" alt="Login Image" className="loginImage" />
        </div>

        {/* Right Section for Form Inputs */}
        <div className="formInputsContainer">
          <div className="titleContainer">
            <h1>Login</h1>
          </div>

          {/* Email Input */}
          <div className="inputContainer">
            <input
              value={email}
              placeholder="Enter your email"
              onChange={(ev) => setEmail(ev.target.value)}
              className="inputBox"
            />
            {emailError && <div className="errorLabel">{emailError}</div>}
          </div>

          {/* Password Input */}
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

          {/* General Error Message */}
          {errorMessage && <div className="errorLabel">{errorMessage}</div>}

          {/* Spinner */}
          {loading && <div className="spinner"></div>}

          {/* Login Button */}
          <div className="inputContainer">
            <input
              className="inputButton"
              type="button"
              onClick={onButtonClick}
              value={loading ? "Logging in..." : "Log in"}
              disabled={loading} // Prevent multiple clicks
            />
          </div>

          {/* Signup Link */}
          <div className="signupLinkContainer">
            <p>Not having an account? <Link to="/signup" className="signupLink">Sign up</Link></p>
          </div>
          <div className="signupLinkContainer">
            <p>Forgot Password? <Link to="/resetresquest" className="signupLink">Reset</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
