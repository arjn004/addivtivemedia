// src/SignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Assuming you have this CSS file

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    number: '',
    email: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form data submitted:', result);

      // Simulate email sending and password generation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowPopup(true);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleContinue = () => {
    setShowPopup(false);
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            placeholder="Enter your mobile number"
          />
        </div>
        <div className="form-group">
          <label>Email ID:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email ID"
          />
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      <p className="switch-form">
        Already have an account? <a href="/login">Login here</a>
      </p>
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Password has been mailed to the email ID.</p>
            <p>By clicking on "Press Continue" you will be redirected to the login page.</p>
            <p>Please enter the field of First Name and Password to login. Thank you.</p>
            <button onClick={handleContinue} className="continue-btn">Press Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
