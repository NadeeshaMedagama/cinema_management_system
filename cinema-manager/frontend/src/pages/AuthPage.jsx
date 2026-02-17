import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import Signup from '../components/Signup';
import './AuthPage.css';

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="cinema-logo">🎬</div>
          <h1>Cinema Palace</h1>
          <p className="subtitle">Your Gateway to Movie Magic</p>
        </div>

        <div className="toggle-buttons">
          <button 
            className={showLogin ? 'active' : ''} 
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button 
            className={!showLogin ? 'active' : ''} 
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {showLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
}

export default AuthPage;
