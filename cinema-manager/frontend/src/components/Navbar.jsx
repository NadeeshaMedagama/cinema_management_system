import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cartService';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadCartCount();
    }
  }, [isAuthenticated, location.pathname]);

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart();
      if (cart && cart.items) {
        const count = cart.items.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          <span className="logo-text">CINEMA PALACE</span>
        </Link>
        
        <button className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/home" 
              className={`nav-link ${isActive('/home') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/movies" 
              className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/merchandise" 
              className={`nav-link ${isActive('/merchandise') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              🛍️ Merchandise
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/cart" 
              className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              🛒 Cart
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/bookings" 
              className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {user?.username}
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
