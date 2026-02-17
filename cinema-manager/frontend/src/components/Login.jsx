import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login({ isAdmin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, adminLogin } = useAuth();

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
      const userData = isAdmin ? await adminLogin(formData) : await login(formData);
      setMessage(`Welcome back, ${userData.username}!${userData.role === 'ADMIN' ? ' (Admin Access)' : ''}`);
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/home';
        }
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isAdmin ? 'Admin Login' : 'Login'}</h2>
      <p className="login-subtitle">
        {isAdmin ? 'Access administrative dashboard' : 'Welcome back! Please login to your account'}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="form-group">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              Logging in
              <span className="loading-spinner"></span>
            </>
          ) : 'Login'}
        </button>
      </form>
      {message && <p className={message.includes('Welcome') ? 'message success' : 'message error'}>{message}</p>}
    </div>
  );
}

export default Login;
