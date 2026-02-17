import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import seatService from '../services/seatService';
import './SeatSelection.css';

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { movie, showtime, ticketQuantity } = location.state || {};
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movie || !showtime || !ticketQuantity) {
      alert('Invalid booking session. Please start from movie details.');
      navigate('/movies');
      return;
    }
    loadSeats();
    
    // Poll for seat updates every 5 seconds to show real-time availability
    const intervalId = setInterval(() => {
      loadSeats();
    }, 5000);
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showtimeId]);

  const loadSeats = async () => {
    try {
      const seatsData = await seatService.getSeatsByShowtime(showtimeId);

      // Check if seats exist for this showtime
      if (!seatsData || seatsData.length === 0) {
        alert('No seats found for this showtime. Please contact support or try another showtime.');
        setLoading(false);
        return;
      }

      if (seats.length > 0) {
        // This is a refresh - check if any selected seats were booked by someone else
        const nowUnavailable = selectedSeats.filter(seat => {
          const updatedSeat = seatsData.find(s => s.id === seat.id);
          return updatedSeat && updatedSeat.status === 'BOOKED';
        });

        if (nowUnavailable.length > 0) {
          alert(`Warning: ${nowUnavailable.length} seat(s) you selected were just booked by another user!`);
          // Remove unavailable seats from selection
          setSelectedSeats(selectedSeats.filter(seat =>
            !nowUnavailable.find(us => us.id === seat.id)
          ));
        }
      }

      setSeats(seatsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading seats:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load seats. Please try again.';
      alert(errorMessage);
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'BOOKED') {
      return; // Can't select booked seats
    }

    const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);
    
    if (seatIndex > -1) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Select seat if limit not reached
      if (selectedSeats.length < ticketQuantity) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert(`You can only select ${ticketQuantity} seats`);
      }
    }
  };

  const getSeatClass = (seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      return 'seat selected';
    }
    if (seat.status === 'BOOKED') {
      return 'seat booked';
    }
    return 'seat available';
  };

  const calculateTotalPrice = () => {
    return selectedSeats.length * showtime.price;
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length !== ticketQuantity) {
      alert(`Please select exactly ${ticketQuantity} seats`);
      return;
    }

    if (seats.length === 0) {
      alert('No seats available for this showtime. Please contact support.');
      return;
    }

    // Navigate to food selection page with booking data
    navigate('/food', {
      state: {
        movie,
        showtime,
        selectedSeats,
        ticketQuantity,
        showtimeId
      }
    });
  };

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  if (loading) {
    return (
      <div className="seat-selection-container">
        <div className="loading-spinner">Loading seats...</div>
      </div>
    );
  }

  return (
    <div className="seat-selection-container">
      <div className="seat-selection-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="movie-info-header">
          <h1>{movie.title}</h1>
          <p>{new Date(showtime.showDateTime).toLocaleString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</p>
          <p>Screen {showtime.screenNumber} • {showtime.format}</p>
        </div>
      </div>

      <div className="screen-indicator">
        <div className="screen">SCREEN</div>
      </div>

      <div className="seats-container">
        {sortedRows.map(row => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats-grid">
              {seatsByRow[row]
                .sort((a, b) => a.column - b.column)
                .map(seat => (
                  <div
                    key={seat.id}
                    className={getSeatClass(seat)}
                    onClick={() => handleSeatClick(seat)}
                    title={`Seat ${seat.row}${seat.column}`}
                  >
                    {seat.column}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="booking-summary">
        <div className="summary-content">
          <div className="selected-info">
            <h3>Selected Seats: {selectedSeats.length} / {ticketQuantity}</h3>
            <div className="selected-seats-list">
              {selectedSeats.map(seat => (
                <span key={seat.id} className="seat-tag">
                  {seat.row}{seat.column}
                </span>
              ))}
            </div>
          </div>
          <div className="price-info">
            <h2>Total: Rs. {calculateTotalPrice().toFixed(2)}</h2>
          </div>
          <button 
            className="confirm-btn" 
            onClick={handleConfirmBooking}
            disabled={selectedSeats.length !== ticketQuantity}
          >
            Continue to Food Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
