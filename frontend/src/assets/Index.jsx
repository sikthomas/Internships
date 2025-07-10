import React, { useState } from 'react';  // Import useState
import './Index.css'; // Assuming you'll style this separately
import { useNavigate } from 'react-router-dom';

function Index(props) {

  const [fullName, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // Added for backend error message

  const { loggedIn, email } = props;
  const navigate = useNavigate();

  // Handle the button click based on whether the user is logged in or not
  const onButtonClick = (action) => {
    if (loggedIn) {
      // Log out logic (you can replace this with your actual logout logic)
      console.log('Logging out...');
    } else {
      // Navigate based on the action: login or signup
      if (action === 'login') {
        navigate('/login');  // Navigate to the login page
      } else if (action === 'signup') {
        navigate('/signup');  // Navigate to the signup page
      }
    }
  };

  // Handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior

    // Reset error messages
    setNameError('');
    setEmailError('');
    setMessageError('');

    let isValid = true;

    // Perform validation before submitting the form
    if (!fullName) {
      setNameError('Name is required');
      isValid = false;
    }
    if (!Email) {
      setEmailError('Email is required');
      isValid = false;
    }
    if (!message) {
      setMessageError('Message is required');
      isValid = false;
    }

    // Proceed if all fields are valid
    if (isValid) {
      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('email', Email);
      formData.append('message', message);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/contactus/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          // On success, you can show a success message or navigate somewhere else
          console.log("Message sent successfully");
        } else {
          // Handle errors returned by the backend
          setErrorMessage(data.detail || 'Message not sent.');
        }
      } catch (error) {
        setErrorMessage('Failed to submit form. Please try again.');
      }
    }
  };

  return (
    <div className="app">
      {/* Top Menu Section */}
      <header className="top-menu">
        <div className="logo">
          <h1>Internship Place</h1>
        </div>
        <button className="apply-btn" onClick={() => onButtonClick('login')}>
          Apply
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Get market-ready skills through our customized mentorship program</h1>
          <p>We move with learners in a step by step guiding manner</p>
          <button className="learn-more-btn">Learn More</button>
        </div>
        <div className="hero-image">
          <img src="/images/heroimage.jpg" alt="Mentorship" />
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-content">
          <div className="about-image">
            <img src="/images/aboutimage.png" alt="about bootcamp" />
          </div>
          <div className="about-text">
            <h1>About Us</h1>
            <p>
              At IC Bootcamp, our team of experts is dedicated to mentoring and uplifting young individuals in ICT courses,
              ranging from certificate to diploma and degree levels, ensuring they graduate as market-ready
              professionals. We welcome students from all educational backgrounds and guide them in selecting
              an area of specialization that aligns with their interests and career goals.
            </p>
            <p>
              Whether it's Application Development, Data Science, Machine Learning, Cybersecurity, Programming, Web Design,
              or Graphic Design, each student is paired with a mentor who provides personalized guidance through
              a 3-month project-based program. During this time, students gain hands-on experience and develop
              real-world skills, preparing them to enter the job market with confidence and competence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2 className="services-title">Our Services</h2>
        <div className="service-row">
          <div className="service-card green-card">
            <div className="service-image">
              <img src="/images/webapp.png" alt="Web App" />
            </div>
            <h3>Web App Development</h3>
            <p>We guide students in web design, development, and deployment of web applications. Students gain skills in Python, JavaScript, Django, and React to build robust, dynamic applications.</p>
          </div>
          <div className="service-card blue-card">
            <div className="service-image">
              <img src="/images/mobileapp.png" alt="Mobile App Development" />
            </div>
            <h3>Mobile App Development</h3>
            <p>Students learn to design and develop responsive mobile apps using modern technologies like Swift, Kotlin, and Flutter, creating seamless experiences across iOS and Android platforms.</p>
          </div>
          <div className="service-card grey-card">
            <div className="service-image">
              <img src="/images/ai.png" alt="AI" />
            </div>
            <h3>Artificial Intelligence</h3>
            <p>Students explore artificial intelligence and machine learning, building intelligent systems with tools like TensorFlow, PyTorch, and Scikit-learn to analyze data and develop predictive models.</p>
          </div>
        </div>
        <div className="service-row">
          <div className="service-card green-card">
            <div className="service-image">
              <img src="/images/cybersecurity.png" alt="Cybersecurity" />
            </div>
            <h3>Cybersecurity</h3>
            <p>We teach students how to protect systems from threats, conduct penetration testing, and implement security measures using tools like Kali Linux and Metasploit to defend against data breaches.</p>
          </div>
          <div className="service-card blue-card">
            <div className="service-image">
              <img src="/images/datascience.png" alt="Data Science" />
            </div>
            <h3>Data Science</h3>
            <p>Students analyze data and gain insights using Python, R, and libraries like Pandas and NumPy. They learn statistical analysis, data visualization, and machine learning to support decision-making.</p>
          </div>
          <div className="service-card grey-card">
            <div className="service-image">
              <img src="/images/iot.png" alt="IoT" />
            </div>
            <h3>Internet of Things</h3>
            <p>We help students develop Internet of Things (IoT) solutions by working with hardware, sensors, and communication protocols to create smart, connected devices that automate real-world tasks.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us">
        <h3>Why Choose Us?</h3>
        <p>
          We offer affordable pricing and customized training that fits your needs. Our bootcamps are tailored
          to help students succeed by providing hands-on experience and mentorship.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="contact">
        <h3>Contact Us</h3>
        <form onSubmit={handleSubmit}>  {/* Use onSubmit for form submission */}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={(ev) => setName(ev.target.value)}
            className="inputBox"
          />
          {nameError && <div className="error">{nameError}</div>} {/* Display error message for name */}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={(ev) => setEmail(ev.target.value)}
            className="inputBox"
          />
          {emailError && <div className="error">{emailError}</div>} {/* Display error message for email */}

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            required
            onChange={(ev) => setMessage(ev.target.value)}
            className="inputBox"
          ></textarea>
          {messageError && <div className="error">{messageError}</div>} {/* Display error message for message */}

          <button type="submit">Send Message</button>
        </form>
        {errorMessage && <div className="error">{errorMessage}</div>} {/* Display backend error message */}
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 IC Bootcamp. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Index;
