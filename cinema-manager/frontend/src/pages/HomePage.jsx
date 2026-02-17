import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

function HomePage() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    // Auto-rotate hero banner every 5 seconds
    if (nowShowing.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % nowShowing.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [nowShowing]);

  const loadMovies = async () => {
    try {
      const [showing, upcoming] = await Promise.all([
        movieService.getNowShowing(),
        movieService.getComingSoon()
      ]);
      setNowShowing(Array.isArray(showing) ? showing : []);
      setComingSoon(Array.isArray(upcoming) ? upcoming : []);
    } catch (error) {
      console.error('Error loading movies:', error);
      setNowShowing([]);
      setComingSoon([]);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    // eslint-disable-next-line
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoIdMatch[1]}`;
    }
    return url;
  };

  const handleWatchTrailer = (movie) => {
    setSelectedTrailer(movie);
  };

  const handleCloseTrailer = () => {
    setSelectedTrailer(null);
  };

  if (loading) {
    return <div className="loading-container">Loading cinema experience...</div>;
  }

  const featuredMovie = nowShowing[currentHeroIndex];

  return (
    <div className="home-page">
      {/* Hero Banner - Scope Cinemas Style */}
      {featuredMovie && (
        <div className="hero-banner" style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">NOW SHOWING</div>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-genre">{featuredMovie.genre} | {featuredMovie.duration} min</p>
            <div className="hero-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-text">{featuredMovie.rating}/10</span>
            </div>
            <p className="hero-description">{featuredMovie.description}</p>
            <div className="hero-actions">
              <Link to={`/movies/${featuredMovie.id}`} className="btn-primary">
                🎫 BUY TICKETS ONLINE
              </Link>
              {featuredMovie.trailerUrl && (
                <button className="btn-secondary" onClick={() => handleWatchTrailer(featuredMovie)}>
                  ▶ WATCH TRAILER
                </button>
              )}
            </div>
          </div>
          <div className="hero-indicators">
            {nowShowing.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentHeroIndex ? 'active' : ''}`}
                onClick={() => setCurrentHeroIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Now Showing Section */}
      <section className="movies-section now-showing-section">
        <div className="section-header">
          <h2 className="section-title">NOW SHOWING</h2>
          <Link to="/movies" className="view-all-link">VIEW ALL →</Link>
        </div>
        <div className="movies-grid-scope">
          {nowShowing.slice(0, 6).map(movie => (
            <div key={movie.id} className="scope-movie-card">
              <div className="scope-poster-container">
                <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
                <div className="scope-overlay">
                  <Link to={`/movies/${movie.id}`} className="scope-buy-btn">
                    BUY TICKETS ONLINE
                  </Link>
                  {movie.trailerUrl && (
                    <button className="scope-trailer-btn" onClick={() => handleWatchTrailer(movie)}>
                      WATCH TRAILER
                    </button>
                  )}
                </div>
              </div>
              <div className="scope-movie-info">
                <h3>{movie.title}</h3>
                <p className="scope-genre">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="movies-section coming-soon-section">
        <div className="section-header">
          <h2 className="section-title">COMING SOON</h2>
          <Link to="/movies" className="view-all-link">VIEW ALL →</Link>
        </div>
        <div className="movies-grid-scope">
          {comingSoon.slice(0, 6).map(movie => (
            <div key={movie.id} className="scope-movie-card">
              <div className="scope-poster-container">
                <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
                <div className="coming-soon-badge">COMING SOON</div>
                <div className="scope-overlay">
                  <div className="release-date">
                    IN CINEMAS {new Date(movie.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                  </div>
                  {movie.trailerUrl && (
                    <button className="scope-trailer-btn" onClick={() => handleWatchTrailer(movie)}>
                      WATCH TRAILER
                    </button>
                  )}
                </div>
              </div>
              <div className="scope-movie-info">
                <h3>{movie.title}</h3>
                <p className="scope-genre">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      <section className="deals-section">
        <div className="section-header">
          <h2 className="section-title">DEALS & EXCLUSIVE</h2>
          <button className="view-all-link">VIEW ALL DEALS →</button>
        </div>
        <div className="deals-grid">
          <div className="deal-card">
            <div className="deal-image" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h3>50% OFF</h3>
              <p>WEEKEND SPECIAL</p>
            </div>
            <div className="deal-info">
              <h4>50% off on Movie tickets for weekends</h4>
              <button className="deal-btn">MORE INFO</button>
            </div>
          </div>
          <div className="deal-card">
            <div className="deal-image" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <h3>BUNDLE</h3>
              <p>MEAL OFFER</p>
            </div>
            <div className="deal-info">
              <h4>Family Bundle Meal Offer</h4>
              <button className="deal-btn">MORE INFO</button>
            </div>
          </div>
          <div className="deal-card">
            <div className="deal-image" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <h3>LOYALTY</h3>
              <p>REWARDS</p>
            </div>
            <div className="deal-info">
              <h4>Spend, Earn and Redeem Points</h4>
              <button className="deal-btn">MORE INFO</button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="newsletter-section">
        <div className="newsletter-content">
          <h3>SUBSCRIBE FOR NEWSLETTER</h3>
          <p>Get the latest movie updates and exclusive deals</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="subscribe-btn">SUBSCRIBE</button>
          </div>
        </div>
      </section> */}

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div className="trailer-modal" onClick={handleCloseTrailer}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseTrailer}>✕</button>
            <h2>{selectedTrailer.title}</h2>
            <div className="video-container">
              <iframe
                src={getYouTubeEmbedUrl(selectedTrailer.trailerUrl)}
                title={selectedTrailer.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
