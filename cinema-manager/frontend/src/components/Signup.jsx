import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

function Signup({ isAdmin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, adminSignup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = isAdmin ? await adminSignup(formData) : await signup(formData);
      setMessage(result.message || (isAdmin ? 'Admin registration successful!' : 'Registration successful!'));
      setFormData({ username: '', email: '', password: '', phone: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>{isAdmin ? 'Admin Sign Up' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
      {message && <p className={message.includes('successful') ? 'message success' : 'message error'}>{message}</p>}
    </div>
  );
}

export default Signup;
