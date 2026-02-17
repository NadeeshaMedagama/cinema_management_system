import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import { useAuth } from '../context/AuthContext';
import './MovieDetailsPage.css';

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    loadMovie();
    loadShowtimes();
  }, [id]);

  const loadMovie = async () => {
    try {
      const response = await movieService.getMovieById(id);
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
      const response = await showtimeService.getShowtimesByMovieId(id);
      setShowtimes(Array.isArray(response) ? response : []);
      
      // Set default date to first available showtime date
      if (response && response.length > 0) {
        const dates = [...new Set(response.map(st => st.showDateTime.split('T')[0]))];
        setSelectedDate(dates[0]);
      }
    } catch (error) {
      console.error('Error loading showtimes:', error);
      setShowtimes([]);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      alert('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (!selectedShowtime) {
      alert('Please select a showtime');
      return;
    }

    // Show ticket quantity modal
    setShowTicketModal(true);
  };

  const handleProceedToSeats = () => {
    if (ticketQuantity < 1 || ticketQuantity > 10) {
      alert('Please select between 1 and 10 tickets');
      return;
    }

    if (ticketQuantity > selectedShowtime.availableSeats) {
      alert(`Only ${selectedShowtime.availableSeats} seats available`);
      return;
    }

    // Navigate to seat selection page
    navigate(`/seat-selection/${selectedShowtime.id}`, { 
      state: { 
        movie: movie,
        showtime: selectedShowtime,
        ticketQuantity: ticketQuantity
      } 
    });
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setTicketQuantity(1);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const formatTime = (showDateTime) => {
    if (!showDateTime) return '';
    const date = new Date(showDateTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (showDateTime) => {
    if (!showDateTime) return '';
    const date = new Date(showDateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return <div className="loading-container">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="loading-container">Movie not found</div>;
  }

  // Get unique dates from showtimes
  const availableDates = showtimes.length > 0
    ? [...new Set(showtimes.map(st => st.showDateTime.split('T')[0]))].sort() 
    : [];

  // Filter showtimes by selected date
  const showtimesForDate = showtimes.filter(st => 
    st.showDateTime.split('T')[0] === selectedDate
  );

  return (
    <div className="movie-details-page">
      {/* Hero Banner */}
      <div 
        className="movie-hero" 
        style={{ backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-poster">
              <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
            </div>
            <div className="hero-info">
              <h1>{movie.title}</h1>
              <div className="movie-meta">
                <span className="rating-badge">⭐ {movie.imdbRating || movie.rating}/10</span>
                <span className="duration">{movie.duration} min</span>
                <span className="rating-cert">{movie.rating}</span>
                <span className="genre">{movie.genre}</span>
              </div>
              <p className="description">{movie.description}</p>
              
              {movie.director && (
                <p className="director"><strong>Director:</strong> {movie.director}</p>
              )}
              
              {movie.cast && movie.cast.length > 0 && (
                <p className="cast"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
              )}

              <div className="hero-actions">
                {movie.trailerUrl && (
                  <button 
                    className="watch-trailer-btn"
                    onClick={() => setSelectedTrailer(movie)}
                  >
                    ▶ Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Selection */}
      {movie.nowShowing && (
        <div className="showtime-section">
          <div className="showtime-container">
            <h2>Select Your Showtime</h2>

            {/* Date Selection */}
            {availableDates.length > 0 ? (
              <>
                <div className="date-selector">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedShowtime(null);
                      }}
                    >
                      <div className="date-label">{formatDate(date + 'T00:00:00')}</div>
                      <div className="date-value">
                        {new Date(date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Showtime Selection */}
                <div className="showtimes-grid">
                  {showtimesForDate.map((showtime) => (
                    <div
                      key={showtime.id}
                      className={`showtime-card ${selectedShowtime?.id === showtime.id ? 'selected' : ''} ${showtime.availableSeats === 0 ? 'sold-out' : ''}`}
                      onClick={() => showtime.availableSeats > 0 && setSelectedShowtime(showtime)}
                    >
                      <div className="showtime-time">{formatTime(showtime.showDateTime)}</div>
                      <div className="showtime-format">{showtime.format}</div>
                      <div className="showtime-screen">Screen {showtime.screenNumber}</div>
                      <div className="showtime-price">Rs. {showtime.price.toFixed(2)}</div>
                      <div className={`showtime-availability ${showtime.availableSeats === 0 ? 'sold-out' : ''}`}>
                        {showtime.availableSeats === 0 ? 
                          'SOLD OUT' : 
                          `${showtime.availableSeats}/${showtime.totalSeats} available`
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book Now Button */}
                {selectedShowtime && (
                  <div className="booking-summary">
                    <div className="summary-details">
                      <h3>Selected Showtime</h3>
                      <p><strong>Date:</strong> {formatDate(selectedShowtime.date)}</p>
                      <p><strong>Time:</strong> {formatTime(selectedShowtime.time)}</p>
                      <p><strong>Format:</strong> {selectedShowtime.format}</p>
                      <p><strong>Screen:</strong> {selectedShowtime.screen}</p>
                      <p><strong>Price:</strong> Rs. {selectedShowtime.price.toFixed(2)} per ticket</p>
                    </div>
                    <button className="book-now-btn" onClick={handleBookNow}>
                      Continue to Seat Selection
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-showtimes">
                <p>No showtimes available for this movie yet. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!movie.nowShowing && (
        <div className="coming-soon-section">
          <div className="coming-soon-content">
            <h2>Coming Soon</h2>
            <p>This movie will be released on {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</p>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div className="trailer-modal" onClick={() => setSelectedTrailer(null)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedTrailer(null)}>×</button>
            <h3>{selectedTrailer.title}</h3>
            <div className="video-container">
              <iframe
                src={getYouTubeEmbedUrl(selectedTrailer.trailerUrl)}
                title={`${selectedTrailer.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Quantity Modal */}
      {showTicketModal && (
        <div className="ticket-modal" onClick={handleCloseTicketModal}>
          <div className="ticket-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseTicketModal}>×</button>
            <h2>🎟️ Select Number of Tickets</h2>
            <div className="ticket-selector">
              <div className="movie-summary">
                <h3>{movie.title}</h3>
                <p><strong>Date:</strong> {formatDate(selectedShowtime.showDateTime)}</p>
                <p><strong>Time:</strong> {formatTime(selectedShowtime.showDateTime)}</p>
                <p><strong>Screen:</strong> {selectedShowtime.screenNumber}</p>
                <p><strong>Format:</strong> {selectedShowtime.format}</p>
                <p className="available-seats">Available Seats: {selectedShowtime.availableSeats}</p>
              </div>
              
              <div className="quantity-control">
                <label>Number of Tickets:</label>
                <div className="quantity-buttons">
                  <button 
                    className="qty-btn" 
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    disabled={ticketQuantity <= 1}
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    value={ticketQuantity} 
                    onChange={(e) => setTicketQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    min="1" 
                    max="10"
                    className="qty-input"
                  />
                  <button 
                    className="qty-btn" 
                    onClick={() => setTicketQuantity(Math.min(10, selectedShowtime.availableSeats, ticketQuantity + 1))}
                    disabled={ticketQuantity >= 10 || ticketQuantity >= selectedShowtime.availableSeats}
                  >
                    +
                  </button>
                </div>
                <p className="quantity-note">Maximum 10 tickets per booking</p>
              </div>

              <div className="price-summary">
                <div className="price-row">
                  <span>Price per ticket:</span>
                  <span>Rs. {selectedShowtime.price.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span>Rs. {(selectedShowtime.price * ticketQuantity).toFixed(2)}</span>
                </div>
              </div>

              <button className="proceed-btn" onClick={handleProceedToSeats}>
                Proceed to Seat Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetailsPage;
