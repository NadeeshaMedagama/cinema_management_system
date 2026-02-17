import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import seatService from '../services/seatService';
import bookingService from '../services/bookingService';
import foodService from '../services/foodService';
import merchandiseService from '../services/merchandiseService';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import './BookingPage.css';

function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [merchandiseItems, setMerchandiseItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [selectedMerchandise, setSelectedMerchandise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    loadMovie();
    loadShowtimes();
    loadFoodItems();
    loadMerchandiseItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  useEffect(() => {
    if (selectedShowtime) {
      loadSeats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShowtime]);

  const loadMovie = async () => {
    try {
      const response = await movieService.getMovieById(movieId);
      setMovie(response);
    } catch (error) {
      console.error('Error loading movie:', error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const loadShowtimes = async () => {
    try {
      const response = await showtimeService.getShowtimesByMovieId(movieId);
      setShowtimes(response);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      setShowtimes([]);
    }
  };

  const loadFoodItems = async () => {
    try {
      const response = await foodService.getAllFoods();
      setFoodItems(response);
    } catch (error) {
      console.error('Error loading food items:', error);
      setFoodItems([]);
    }
  };

  const loadMerchandiseItems = async () => {
    try {
      const response = await merchandiseService.getAllMerchandise();
      setMerchandiseItems(response);
    } catch (error) {
      console.error('Error loading merchandise:', error);
      setMerchandiseItems([]);
    }
  };

  const loadSeats = async () => {
    try {
      const response = await seatService.getSeatsByShowtime(selectedShowtime.id);
      setSeats(response);
      setSelectedSeats([]); // Clear selection when changing showtime
    } catch (error) {
      console.error('Error loading seats:', error);
      setSeats([]);
    }
  };



  const toggleSeat = (seat) => {
    if (seat.status !== 'AVAILABLE') {
      return; // Can't select booked seats
    }
    
    const seatId = seat.id;
    if (selectedSeats.find(s => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const updateFoodQuantity = (foodItem, change) => {
    const existing = selectedFood.find(item => item.foodItemId === foodItem.id);
    
    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        setSelectedFood(selectedFood.filter(item => item.foodItemId !== foodItem.id));
      } else {
        setSelectedFood(selectedFood.map(item =>
          item.foodItemId === foodItem.id
            ? { ...item, quantity: newQuantity, subtotal: foodItem.price * newQuantity }
            : item
        ));
      }
    } else if (change > 0) {
      setSelectedFood([...selectedFood, {
        foodItemId: foodItem.id,
        name: foodItem.name,
        quantity: 1,
        price: foodItem.price,
        subtotal: foodItem.price
      }]);
    }
  };

  const updateMerchandiseQuantity = (merchItem, change) => {
    const existing = selectedMerchandise.find(item => item.merchandiseId === merchItem.id);
    
    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) {
        setSelectedMerchandise(selectedMerchandise.filter(item => item.merchandiseId !== merchItem.id));
      } else {
        setSelectedMerchandise(selectedMerchandise.map(item =>
          item.merchandiseId === merchItem.id
            ? { ...item, quantity: newQuantity, subtotal: merchItem.price * newQuantity }
            : item
        ));
      }
    } else if (change > 0) {
      setSelectedMerchandise([...selectedMerchandise, {
        merchandiseId: merchItem.id,
        name: merchItem.name,
        quantity: 1,
        price: merchItem.price,
        subtotal: merchItem.price
      }]);
    }
  };

  const getFoodQuantity = (foodId) => {
    const item = selectedFood.find(item => item.foodItemId === foodId);
    return item ? item.quantity : 0;
  };

  const getMerchandiseQuantity = (merchId) => {
    const item = selectedMerchandise.find(item => item.merchandiseId === merchId);
    return item ? item.quantity : 0;
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book tickets');
      navigate('/');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    if (!selectedShowtime) {
      alert('Please select a showtime');
      return;
    }

    try {
      const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      const foodTotal = selectedFood.reduce((sum, item) => sum + item.subtotal, 0);
      const merchandiseTotal = selectedMerchandise.reduce((sum, item) => sum + item.subtotal, 0);
      const totalAmount = seatsTotal + foodTotal + merchandiseTotal;
      
      const bookingData = {
        userId: user.id,
        movieId: movieId,
        showtimeId: selectedShowtime.id,
        seatIds: selectedSeats.map(s => s.id),
        seatNumbers: selectedSeats.map(s => s.seatNumber),
        numberOfSeats: selectedSeats.length,
        totalAmount: totalAmount,
        foodItems: selectedFood,
        foodTotal: foodTotal,
        merchandiseItems: selectedMerchandise,
        merchandiseTotal: merchandiseTotal,
        showDate: selectedShowtime.showDateTime
      };

      // Create booking first (reserves the seats)
      const booking = await bookingService.createBooking(bookingData);
      
      let message = `Booking confirmed!\nBooking Code: ${booking.bookingCode}\nSeats: ${booking.seatNumbers.join(', ')}\n`;
      
      if (selectedFood.length > 0) {
        message += `\nFood Items: ${selectedFood.length} item(s) - $${foodTotal.toFixed(2)}`;
      }
      
      if (selectedMerchandise.length > 0) {
        message += `\nMerchandise: ${selectedMerchandise.length} item(s) - $${merchandiseTotal.toFixed(2)}`;
      }
      
      message += `\n\nTotal: $${booking.totalAmount.toFixed(2)}`;
      
      alert(message);
      navigate('/profile');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error creating booking: ' + (error.response?.data?.message || error.message || 'Some seats may have been booked by another user. Please refresh and try again.'));
      loadSeats(); // Refresh seats to show updated availability
    }
  };


  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Payment successful - booking is already created and seats are reserved
      alert(`Payment Successful!\nTransaction ID: ${paymentResult.transactionId}\nBooking Code: ${createdBooking.bookingCode}\nSeats Confirmed: ${createdBooking.seatNumbers.join(', ')}\nTotal Paid: $${createdBooking.totalAmount.toFixed(2)}\n\nThank you for your booking!`);
      
      // Clear the booking state and navigate to profile
      setCreatedBooking(null);
      setSelectedSeats([]);
      navigate('/profile');
    } catch (error) {
      console.error('Post-payment error:', error);
      alert(`Payment successful! Transaction ID: ${paymentResult.transactionId}\nBooking Code: ${createdBooking.bookingCode}\n\nYour seats are confirmed!`);
      navigate('/profile');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!movie) {
    return <div className="loading-container">Movie not found</div>;
  }


  const formatTime = (timeString) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group seats by row for display
  const groupedSeats = {};
  seats.forEach(seat => {
    if (!groupedSeats[seat.row]) {
      groupedSeats[seat.row] = [];
    }
    groupedSeats[seat.row].push(seat);
  });

  // Sort rows alphabetically
  const sortedRows = Object.keys(groupedSeats).sort();

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="movie-details">
          <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="genre">{movie.genre}</p>
            <p className="rating">⭐ {movie.imdbRating || movie.rating}/10</p>
            <p className="duration">⏱️ {movie.duration} min</p>
            <p className="description">{movie.description}</p>
          </div>
        </div>

        <div className="showtime-selection">
          <h2>Select Showtime</h2>
          {showtimes.length === 0 ? (
            <p className="no-showtimes">No showtimes available for this movie. Please check back later.</p>
          ) : (
            <div className="showtimes">
              {showtimes.map(showtime => (
                <button
                  key={showtime.id}
                  className={`showtime-btn ${selectedShowtime?.id === showtime.id ? 'selected' : ''}`}
                  onClick={() => setSelectedShowtime(showtime)}
                >
                  <div className="showtime-date">{formatDate(showtime.date)}</div>
                  <div className="showtime-time">{formatTime(showtime.time)}</div>
                  <div className="showtime-format">{showtime.format}</div>
                  <div className="showtime-screen">Screen {showtime.screen}</div>
                  <div className="showtime-price">${showtime.price.toFixed(2)}</div>
                  <div className="seats-available">
                    {showtime.availableSeats > 0 ? 
                      `${showtime.availableSeats} seats available` : 
                      'Sold Out'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedShowtime && (
          <div className="seat-selection">
            <h2>Select Your Seats</h2>
            <div className="screen">SCREEN</div>
            {seats.length === 0 ? (
              <p>Loading seats...</p>
            ) : (
              <>
                <div className="seats-container">
                  {sortedRows.map(row => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      {groupedSeats[row]
                        .sort((a, b) => a.column - b.column)
                        .map(seat => {
                          const isSelected = selectedSeats.find(s => s.id === seat.id);
                          const isBooked = seat.status === 'BOOKED';
                          return (
                            <button
                              key={seat.id}
                              className={`seat ${seat.type.toLowerCase()} ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                              onClick={() => toggleSeat(seat)}
                              disabled={isBooked}
                              title={`${seat.seatNumber} - ${seat.type} - $${seat.price.toFixed(2)}`}
                            >
                              {seat.column}
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>

                <div className="seat-legend">
                  <div className="legend-item">
                    <span className="seat standard available"></span> Standard
                  </div>
                  <div className="legend-item">
                    <span className="seat premium available"></span> Premium
                  </div>
                  <div className="legend-item">
                    <span className="seat vip available"></span> VIP
                  </div>
                  <div className="legend-item">
                    <span className="seat selected"></span> Selected
                  </div>
                  <div className="legend-item">
                    <span className="seat booked"></span> Booked
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Food Items Section */}
        <div className="food-selection">
          <h2>🍿 Add Food & Drinks</h2>
          {foodItems.length === 0 ? (
            <p className="no-items">No food items available at the moment.</p>
          ) : (
            <div className="items-grid">
              {foodItems.map(food => (
                <div key={food.id} className="item-card">
                  <img 
                    src={food.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={food.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <h4>{food.name}</h4>
                    <p className="item-category">{food.category}</p>
                    {food.size && <p className="item-size">{food.size}</p>}
                    <p className="item-price">${food.price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateFoodQuantity(food, -1)}
                        disabled={getFoodQuantity(food.id) === 0}
                      >
                        -
                      </button>
                      <span className="quantity">{getFoodQuantity(food.id)}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateFoodQuantity(food, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Merchandise Section */}
        <div className="merchandise-selection">
          <h2>🎁 Add Merchandise</h2>
          {merchandiseItems.length === 0 ? (
            <p className="no-items">No merchandise available at the moment.</p>
          ) : (
            <div className="items-grid">
              {merchandiseItems.map(merch => (
                <div key={merch.id} className="item-card">
                  <img 
                    src={merch.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={merch.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <h4>{merch.name}</h4>
                    <p className="item-category">{merch.category}</p>
                    {merch.relatedMovie && <p className="item-movie">{merch.relatedMovie}</p>}
                    <p className="item-price">${merch.price.toFixed(2)}</p>
                    {merch.stock !== undefined && (
                      <p className="item-stock">{merch.stock > 0 ? `${merch.stock} in stock` : 'Out of stock'}</p>
                    )}
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateMerchandiseQuantity(merch, -1)}
                        disabled={getMerchandiseQuantity(merch.id) === 0}
                      >
                        -
                      </button>
                      <span className="quantity">{getMerchandiseQuantity(merch.id)}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateMerchandiseQuantity(merch, 1)}
                        disabled={merch.stock !== undefined && getMerchandiseQuantity(merch.id) >= merch.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          
          {!createdBooking && (
            <>
              <p>Seat Details:</p>
              <ul className="seat-details">
                {selectedSeats.map(seat => (
                  <li key={seat.id}>
                    {seat.seatNumber} ({seat.type}) - ${seat.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="subtotal">Seats Total: ${selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}</p>
            </>
          )}
          
          {selectedFood.length > 0 && (
            <>
              <p className="section-title">Food & Drinks:</p>
              <ul className="item-details">
                {selectedFood.map((item, index) => (
                  <li key={index}>
                    {item.name} x{item.quantity} - ${item.subtotal.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="subtotal">Food Total: ${selectedFood.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</p>
            </>
          )}
          
          {selectedMerchandise.length > 0 && (
            <>
              <p className="section-title">Merchandise:</p>
              <ul className="item-details">
                {selectedMerchandise.map((item, index) => (
                  <li key={index}>
                    {item.name} x{item.quantity} - ${item.subtotal.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="subtotal">Merchandise Total: ${selectedMerchandise.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</p>
            </>
          )}
          
          <p className="total">
            Total: ${(
              selectedSeats.reduce((sum, seat) => sum + seat.price, 0) +
              selectedFood.reduce((sum, item) => sum + item.subtotal, 0) +
              selectedMerchandise.reduce((sum, item) => sum + item.subtotal, 0)
            ).toFixed(2)}
          </p>
          <button 
            className="confirm-btn" 
            onClick={handleBooking}
            disabled={!selectedShowtime || selectedSeats.length === 0}
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={createdBooking?.totalAmount || 0}
        onPaymentSuccess={handlePaymentSuccess}
        paymentType="BOOKING"
        referenceId={createdBooking?.id || null}
      />
    </div>
  );
}

export default BookingPage;
