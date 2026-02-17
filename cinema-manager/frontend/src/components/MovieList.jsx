import React, { useState, useEffect } from 'react';
import movieService from '../services/movieService';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('nowShowing');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let data;
      switch (activeTab) {
        case 'nowShowing':
          data = await movieService.getNowShowing();
          break;
        case 'comingSoon':
          data = await movieService.getComingSoon();
          break;
        case 'popular':
          data = await movieService.getPopular();
          break;
        default:
          data = await movieService.getAllMovies();
      }
      setMovies(data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const data = await movieService.searchMovies(searchQuery);
        setMovies(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchMovies();
    }
  };

  const handleMovieClick = async (movieId) => {
    try {
      await movieService.incrementView(movieId);
      // Navigate to movie details
      window.location.href = `/movie/${movieId}`;
    } catch (error) {
      console.error('Failed to increment view:', error);
    }
  };

  return (
    <div className="movie-list-container">
      <header className="movie-header">
        <h1>🎬 Movie Listings</h1>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="movie-tabs">
          <button
            className={activeTab === 'nowShowing' ? 'active' : ''}
            onClick={() => setActiveTab('nowShowing')}
          >
            Now Showing
          </button>
          <button
            className={activeTab === 'comingSoon' ? 'active' : ''}
            onClick={() => setActiveTab('comingSoon')}
          >
            Coming Soon
          </button>
          <button
            className={activeTab === 'popular' ? 'active' : ''}
            onClick={() => setActiveTab('popular')}
          >
            Popular
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="movie-poster">
                  <img src={movie.posterUrl} alt={movie.title} />
                  {movie.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="genre">{movie.genre}</p>
                  <div className="movie-meta">
                    <span className="rating">⭐ {movie.rating}</span>
                    <span className="duration">🕐 {movie.duration} min</span>
                  </div>
                  <div className="movie-stats">
                    <span>👁️ {movie.viewCount}</span>
                    <span>🎫 {movie.bookingCount}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-movies">No movies found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieList;
