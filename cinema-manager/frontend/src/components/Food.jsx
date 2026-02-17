import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import foodService from '../services/foodService';
import merchandiseService from '../services/merchandiseService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import './Food.css';

const Food = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { movie, showtime, selectedSeats, ticketQuantity, showtimeId } = location.state || {};

  const [foodItems, setFoodItems] = useState([]);
  const [merchandiseItems, setMerchandiseItems] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [selectedMerchandise, setSelectedMerchandise] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState('food');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  useEffect(() => {
    if (!movie || !showtime || !selectedSeats || !ticketQuantity) {
      alert('Invalid booking session. Please start from movie details.');
      navigate('/movies');
      return;
    }
    loadFoodItems();
    loadMerchandise();
  }, []);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const data = await foodService.getAllFoods();
      setFoodItems(data);
    } catch (error) {
      console.error('Error loading food items:', error);
      alert('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const loadMerchandise = async () => {
    try {
      const data = await merchandiseService.getAllMerchandise();
      setMerchandiseItems(data);
    } catch (error) {
      console.error('Error loading merchandise:', error);
    }
  };

  const handleQuantityChange = (foodId, change) => {
    setSelectedFoods(prev => {
      const currentQty = prev[foodId]?.quantity || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        const { [foodId]: removed, ...rest } = prev;
        return rest;
      }
      
      const food = foodItems.find(f => f.id === foodId);
      return {
        ...prev,
        [foodId]: {
          ...food,
          quantity: newQty,
          subtotal: food.price * newQty
        }
      };
    });
  };

  const handleMerchandiseQuantityChange = (merchandiseId, change) => {
    setSelectedMerchandise(prev => {
      const currentQty = prev[merchandiseId]?.quantity || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        const { [merchandiseId]: removed, ...rest } = prev;
        return rest;
      }
      
      const merchandise = merchandiseItems.find(m => m.id === merchandiseId);
      
      // Check stock availability
      if (merchandise.stock < newQty) {
        alert(`Only ${merchandise.stock} units available in stock`);
        return prev;
      }
      
      return {
        ...prev,
        [merchandiseId]: {
          ...merchandise,
          quantity: newQty,
          subtotal: merchandise.price * newQty
        }
      };
    });
  };

  const calculateFoodTotal = () => {
    return Object.values(selectedFoods).reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateMerchandiseTotal = () => {
    return Object.values(selectedMerchandise).reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTicketTotal = () => {
    return selectedSeats.length * showtime.price;
  };

  const calculateGrandTotal = () => {
    return calculateTicketTotal() + calculateFoodTotal() + calculateMerchandiseTotal();
  };

  const handleConfirmBooking = () => {
    const foodItemsList = Object.values(selectedFoods).map(item => ({
      foodItemId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    const bookingData = {
      userId: user.id,
      movieId: movie.id,
      showtimeId: showtimeId,
      seatIds: selectedSeats.map(seat => seat.id),
      seatNumbers: selectedSeats.map(seat => `${seat.row}${seat.column}`),
      numberOfSeats: selectedSeats.length,
      totalAmount: calculateGrandTotal(),
      foodItems: foodItemsList,
      foodTotal: calculateFoodTotal(),
      showDate: showtime.showDateTime
    };

    setPendingBookingData(bookingData);
    setShowPayment(true);
  };

  const handleSkipFood = () => {
    const bookingData = {
      userId: user.id,
      movieId: movie.id,
      showtimeId: showtimeId,
      seatIds: selectedSeats.map(seat => seat.id),
      seatNumbers: selectedSeats.map(seat => `${seat.row}${seat.column}`),
      numberOfSeats: selectedSeats.length,
      totalAmount: calculateTicketTotal(),
      foodItems: [],
      foodTotal: 0,
      showDate: showtime.showDateTime
    };

    setPendingBookingData(bookingData);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (payment) => {
    try {
      setBookingInProgress(true);

      const response = await bookingService.createBooking(pendingBookingData);

      alert(`Payment & Booking Successful!\n\nBooking Code: ${response.bookingCode}\nTransaction ID: ${payment.transactionId}\nSeats: ${pendingBookingData.seatNumbers.join(', ')}\nTotal: Rs.${pendingBookingData.totalAmount.toFixed(2)}`);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking';
      alert(`Booking failed: ${errorMessage}\nYour payment was successful. Please contact support with Transaction ID: ${payment.transactionId}`);
    } finally {
      setBookingInProgress(false);
      setShowPayment(false);
      setPendingBookingData(null);
    }
  };

  const categories = ['ALL', 'POPCORN', 'DRINKS', 'SNACKS', 'COMBOS'];
  const merchandiseCategories = ['ALL', 'TOYS', 'ACTION_FIGURES', 'PLUSHIES', 'POSTERS', 'T-SHIRTS', 'MUGS', 'COLLECTIBLES'];
  
  const filteredFoodItems = activeCategory === 'ALL' 
    ? foodItems 
    : foodItems.filter(item => item.category === activeCategory);

  const filteredMerchandiseItems = activeCategory === 'ALL'
    ? merchandiseItems
    : merchandiseItems.filter(item => item.category === activeCategory);

  if (loading) {
    return <div className="loading-container">Loading food items...</div>;
  }

  return (
    <div className="food-selection-page">
      <div className="food-container">
        <div className="food-header">
          <h1>Add Food & Merchandise</h1>
          <p className="food-subtitle">Enhance your movie experience</p>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>📽️ {movie?.title}</h3>
          <p>🎬 {new Date(showtime?.showDateTime).toLocaleString()}</p>
          <p>🎫 Seats: {selectedSeats?.map(s => `${s.row}${s.column}`).join(', ')}</p>
          <p>💵 Ticket Total: Rs. {calculateTicketTotal().toFixed(2)}</p>
        </div>

        {/* Tab Selection */}
        <div className="tab-selector">
          <button 
            className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => { setActiveTab('food'); setActiveCategory('ALL'); }}
          >
            🍿 Food & Beverages
          </button>
          <button 
            className={`tab-btn ${activeTab === 'merchandise' ? 'active' : ''}`}
            onClick={() => { setActiveTab('merchandise'); setActiveCategory('ALL'); }}
          >
            🎁 Merchandise
          </button>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {(activeTab === 'food' ? categories : merchandiseCategories).map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        {activeTab === 'food' && (
          <div className="food-grid">
            {filteredFoodItems.map(food => {
              const selectedQty = selectedFoods[food.id]?.quantity || 0;
              
              return (
                <div key={food.id} className="food-card">
                  <div className="food-image">
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={food.name} />
                    ) : (
                      <div className="food-placeholder">
                        {food.category === 'POPCORN' && '🍿'}
                        {food.category === 'DRINKS' && '🥤'}
                        {food.category === 'SNACKS' && '🍫'}
                        {food.category === 'COMBOS' && '🎁'}
                      </div>
                    )}
                    {food.category && (
                      <span className="food-badge">{food.category}</span>
                    )}
                  </div>
                  <div className="food-info">
                    <h3>{food.name}</h3>
                    <p className="food-description">{food.description}</p>
                    <div className="food-price-row">
                      <span className="food-price">Rs. {food.price.toFixed(2)}</span>
                      {selectedQty === 0 ? (
                        <button 
                          className="add-btn"
                          onClick={() => handleQuantityChange(food.id, 1)}
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button onClick={() => handleQuantityChange(food.id, -1)}>−</button>
                          <span>{selectedQty}</span>
                          <button onClick={() => handleQuantityChange(food.id, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Merchandise Items Grid */}
        {activeTab === 'merchandise' && (
          <div className="food-grid">
            {filteredMerchandiseItems.map(merchandise => {
              const selectedQty = selectedMerchandise[merchandise.id]?.quantity || 0;
              
              return (
                <div key={merchandise.id} className="food-card">
                  <div className="food-image">
                    <img 
                      src={merchandise.imageUrl || 'https://via.placeholder.com/200x200?text=No+Image'} 
                      alt={merchandise.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                    />
                    {merchandise.category && (
                      <span className="food-badge">{merchandise.category.replace('_', ' ')}</span>
                    )}
                    {merchandise.stock < 10 && merchandise.stock > 0 && (
                      <span className="stock-badge">Only {merchandise.stock} left</span>
                    )}
                    {merchandise.stock === 0 && (
                      <span className="stock-badge out-of-stock">Out of Stock</span>
                    )}
                  </div>
                  <div className="food-info">
                    <h3>{merchandise.name}</h3>
                    {merchandise.characterName && (
                      <p className="character-tag">⭐ {merchandise.characterName}</p>
                    )}
                    {merchandise.relatedMovie && (
                      <p className="movie-tag">🎬 {merchandise.relatedMovie}</p>
                    )}
                    <p className="food-description">{merchandise.description}</p>
                    <div className="food-price-row">
                      <span className="food-price">Rs. {merchandise.price.toFixed(2)}</span>
                      {merchandise.stock === 0 ? (
                        <button className="add-btn" disabled>OUT OF STOCK</button>
                      ) : selectedQty === 0 ? (
                        <button 
                          className="add-btn"
                          onClick={() => handleMerchandiseQuantityChange(merchandise.id, 1)}
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button onClick={() => handleMerchandiseQuantityChange(merchandise.id, -1)}>−</button>
                          <span>{selectedQty}</span>
                          <button onClick={() => handleMerchandiseQuantityChange(merchandise.id, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart Summary */}
        {(Object.keys(selectedFoods).length > 0 || Object.keys(selectedMerchandise).length > 0) && (
          <div className="cart-summary">
            <h3>Your Order</h3>
            
            {Object.keys(selectedFoods).length > 0 && (
              <>
                <h4 style={{marginTop: '10px', color: '#666'}}>🍿 Food Items</h4>
                {Object.values(selectedFoods).map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}
            
            {Object.keys(selectedMerchandise).length > 0 && (
              <>
                <h4 style={{marginTop: '10px', color: '#666'}}>🎁 Merchandise</h4>
                {Object.values(selectedMerchandise).map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="food-actions">
          <div className="total-section">
            <div className="total-breakdown">
              <div className="total-row">
                <span>Tickets:</span>
                <span>Rs. {calculateTicketTotal().toFixed(2)}</span>
              </div>
              {calculateFoodTotal() > 0 && (
                <div className="total-row">
                  <span>Food:</span>
                  <span>Rs. {calculateFoodTotal().toFixed(2)}</span>
                </div>
              )}
              {calculateMerchandiseTotal() > 0 && (
                <div className="total-row">
                  <span>Merchandise:</span>
                  <span>Rs. {calculateMerchandiseTotal().toFixed(2)}</span>
                </div>
              )}
              <div className="total-row grand-total">
                <span>Grand Total:</span>
                <span>Rs. {calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="skip-btn"
              onClick={handleSkipFood}
              disabled={bookingInProgress}
            >
              Skip & Book
            </button>
            <button 
              className="confirm-btn"
              onClick={handleConfirmBooking}
              disabled={bookingInProgress || (Object.keys(selectedFoods).length === 0 && Object.keys(selectedMerchandise).length === 0)}
            >
              {bookingInProgress ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        amount={pendingBookingData?.totalAmount || 0}
        onPaymentSuccess={handlePaymentSuccess}
        bookingId={null}
        orderId={null}
        paymentType="BOOKING"
      />
    </div>
  );
};

export default Food;
