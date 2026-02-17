import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import './MoviesPage.css';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [genres, setGenres] = useState(['All']);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedGenre, movies]);

  const loadMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      const movieData = Array.isArray(response) ? response : [];
      setMovies(movieData);
      setFilteredMovies(movieData);
      
      // Extract unique individual genres from all movies
      const allGenres = new Map(); // Use Map to store lowercase -> proper case mapping
      movieData.forEach(movie => {
        if (movie.genre) {
          // Split by comma and trim whitespace
          const genreList = movie.genre.split(',').map(g => g.trim());
          genreList.forEach(genre => {
            const lowerGenre = genre.toLowerCase();
            // Keep the first occurrence's capitalization
            if (!allGenres.has(lowerGenre)) {
              allGenres.set(lowerGenre, genre);
            }
          });
        }
      });
      
      // Sort genres alphabetically and add 'All' at the beginning
      const uniqueGenres = ['All', ...Array.from(allGenres.values()).sort()];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(movie => {
        if (!movie.genre) return false;
        // Split genres by comma and check if selected genre is in the list
        const genreList = movie.genre.split(',').map(g => g.trim().toLowerCase());
        return genreList.includes(selectedGenre.toLowerCase());
      });
    }

    setFilteredMovies(filtered);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    // eslint-disable-next-line
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
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
    return <div className="loading-container">Loading movies...</div>;
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>🎬 All Movies</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="genre-filters">
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="movies-grid">
        {filteredMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movies/${movie.id}`} className="movie-link">
              <div className="movie-poster-container">
                <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} />
                {movie.trailerUrl && (
                  <div className="trailer-overlay" onClick={(e) => { e.preventDefault(); handleWatchTrailer(movie); }}>
                    <div className="play-icon">▶</div>
                    <span>Watch Trailer</span>
                  </div>
                )}
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-genre">{movie.genre}</p>
                <p className="movie-rating">⭐ {movie.rating}/10</p>
                <p className="movie-duration">⏱️ {movie.duration} min</p>
                <p className="movie-description">{movie.description?.substring(0, 100)}...</p>
              </div>
            </Link>
            <div className="movie-actions">
              {movie.nowShowing ? (
                <Link to={`/movies/${movie.id}`} className="book-btn">
                  <span>🎟️</span>
                  <span>View Showtimes</span>
                </Link>
              ) : (
                <button className="coming-soon-btn" disabled>
                  <span>🔜</span>
                  <span>Coming Soon</span>
                </button>
              )}
              {movie.trailerUrl && (
                <button className="trailer-btn" onClick={() => handleWatchTrailer(movie)}>
                  <span className="play-icon-btn">▶</span>
                  <span>Trailer</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="no-movies">
          <p>No movies found matching your criteria</p>
        </div>
      )}

      {selectedTrailer && (
        <div className="trailer-modal" onClick={handleCloseTrailer}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseTrailer}>×</button>
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
    </div>
  );
}

export default MoviesPage;
