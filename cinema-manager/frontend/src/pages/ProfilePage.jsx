import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user, isEditing]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Load real bookings from backend
      const userBookings = await bookingService.getUserBookings(user.id);
      setBookings(userBookings || []);
      
      // Extract food and merchandise orders from bookings
      const foodAndMerchandiseOrders = [];
      userBookings.forEach(booking => {
        if ((booking.foodItems && booking.foodItems.length > 0) || 
            (booking.merchandiseItems && booking.merchandiseItems.length > 0)) {
          foodAndMerchandiseOrders.push({
            id: booking.id,
            bookingCode: booking.bookingCode,
            movieTitle: booking.movieTitle,
            date: booking.bookingDate,
            foodItems: booking.foodItems || [],
            merchandiseItems: booking.merchandiseItems || [],
            foodTotal: booking.foodTotal || 0,
            merchandiseTotal: booking.merchandiseTotal || 0
          });
        }
      });
      
      setOrders(foodAndMerchandiseOrders);
    } catch (error) {
      console.error('Error loading user data:', error);
      setBookings([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    // If changing password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone
      };

      // Include password fields only if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`http://localhost:8081/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Refresh page to update user context
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h1>{user?.username}</h1>
            <p className="email">{user?.email}</p>
            <p className="phone">{user?.phone}</p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-info">
              <h2>Account Information</h2>
              
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              
              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              {!isEditing ? (
                <>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Username</label>
                      <p>{user?.username}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{user?.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{user?.phone}</p>
                    </div>
                    <div className="info-item">
                      <label>Role</label>
                      <p>{user?.role}</p>
                    </div>
                    <div className="info-item">
                      <label>Member Since</label>
                      <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={errors.username ? 'error' : ''}
                      />
                      {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="password-section">
                      <h3>Change Password (Optional)</h3>
                      
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={errors.currentPassword ? 'error' : ''}
                          placeholder="Enter current password"
                        />
                        {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={errors.newPassword ? 'error' : ''}
                          placeholder="Enter new password"
                        />
                        {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={errors.confirmPassword ? 'error' : ''}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleUpdateProfile} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-list">
              <h2>My Bookings</h2>
              {loading ? (
                <p className="loading-text">Loading bookings...</p>
              ) : bookings.length > 0 ? (
                bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-info">
                      <h3>{booking.movieTitle || 'Movie'}</h3>
                      <p>Booking Code: {booking.bookingCode}</p>
                      <p>Date: {new Date(booking.showDate).toLocaleDateString()}</p>
                      <p>Seats: {booking.seatNumbers?.join(', ')}</p>
                      <p>Status: <span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span></p>
                    </div>
                    <div className="booking-price">
                      <p className="price">Rs. {booking.totalAmount?.toFixed(2)}</p>
                      <p className="seat-count">{booking.numberOfSeats} seat(s)</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No bookings yet</p>
                  <p className="subtitle">Book your first movie to see it here!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-list">
              <h2>My Orders</h2>
              {loading ? (
                <p className="loading-text">Loading orders...</p>
              ) : orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3>{order.movieTitle}</h3>
                      <span className="booking-code">Booking: {order.bookingCode}</span>
                      <p className="order-date">
                        {new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div className="order-items">
                      {order.foodItems.length > 0 && (
                        <div className="items-section">
                          <h4>🍿 Food & Drinks</h4>
                          <ul className="items-list">
                            {order.foodItems.map((item, index) => (
                              <li key={index}>
                                <span className="item-name">{item.name}</span>
                                <span className="item-qty">x{item.quantity}</span>
                                <span className="item-price">Rs. {item.subtotal.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="section-total">Food Total: Rs. {order.foodTotal.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {order.merchandiseItems.length > 0 && (
                        <div className="items-section">
                          <h4>🎁 Merchandise</h4>
                          <ul className="items-list">
                            {order.merchandiseItems.map((item, index) => (
                              <li key={index}>
                                <span className="item-name">{item.name}</span>
                                <span className="item-qty">x{item.quantity}</span>
                                <span className="item-price">Rs. {item.subtotal.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="section-total">Merchandise Total: Rs. {order.merchandiseTotal.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="order-total">
                      <strong>Total: Rs. {(order.foodTotal + order.merchandiseTotal).toFixed(2)}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No food or merchandise orders yet</p>
                  <p className="subtitle">Add food and merchandise with your next booking!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
