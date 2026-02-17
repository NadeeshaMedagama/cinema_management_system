import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrailerPlayer.css';

const TrailerPlayer = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/movies');
      setMovies(response.data.filter(movie => movie.trailerUrl));
      setLoading(false);
    } catch (error) {
      console.error('Error loading movies:', error);
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    // eslint-disable-next-line
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    
    return url;
  };

  const handlePlayTrailer = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseTrailer = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return <div className="loading">Loading trailers...</div>;
  }

  return (
    <div className="trailer-player">
      <h2>Watch Movie Trailers</h2>
      
      {movies.length === 0 ? (
        <p className="no-trailers">No trailers available at the moment.</p>
      ) : (
        <div className="trailers-grid">
          {movies.map(movie => (
            <div key={movie.id} className="trailer-card">
              <div className="trailer-poster">
                <img 
                  src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={movie.title}
                />
                <div className="play-overlay" onClick={() => handlePlayTrailer(movie)}>
                  <div className="play-button">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="38" fill="rgba(229, 9, 20, 0.9)" />
                      <polygon points="32,25 32,55 55,40" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="trailer-info">
                <h3>{movie.title}</h3>
                <p className="movie-genre">{movie.genre}</p>
                <p className="movie-duration">{movie.duration} mins</p>
                <button 
                  className="btn-watch-trailer"
                  onClick={() => handlePlayTrailer(movie)}
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <div className="trailer-modal" onClick={handleCloseTrailer}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseTrailer}>
              ×
            </button>
            <h3>{selectedMovie.title}</h3>
            <div className="video-container">
              <iframe
                src={getYouTubeEmbedUrl(selectedMovie.trailerUrl)}
                title={`${selectedMovie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="movie-details">
              <p><strong>Genre:</strong> {selectedMovie.genre}</p>
              <p><strong>Duration:</strong> {selectedMovie.duration} mins</p>
              <p><strong>Rating:</strong> {selectedMovie.rating}/10</p>
              <p><strong>Release Date:</strong> {new Date(selectedMovie.releaseDate).toLocaleDateString()}</p>
              {selectedMovie.description && (
                <p className="description"><strong>Description:</strong> {selectedMovie.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailerPlayer;
