package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Movie;
import com.example.cinema.managing.system.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public List<Movie> getNowShowingMovies() {
        return movieRepository.findByNowShowingTrueOrderByBookingCountDesc();
    }

    public List<Movie> getComingSoonMovies() {
        return movieRepository.findByComingSoonTrue();
    }

    public List<Movie> getFeaturedMovies() {
        return movieRepository.findByFeaturedTrue();
    }

    public List<Movie> getMostPopularMovies() {
        return movieRepository.findTop10ByOrderByBookingCountDesc();
    }

    public List<Movie> getMostViewedMovies() {
        return movieRepository.findTop10ByOrderByViewCountDesc();
    }

    public List<Movie> searchMovies(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> getMoviesByCategory(String categoryId) {
        return movieRepository.findByCategoryId(categoryId);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public Movie createMovie(Movie movie) {
        movie.setCreatedAt(LocalDateTime.now());
        movie.setUpdatedAt(LocalDateTime.now());
        return movieRepository.save(movie);
    }

    public Movie updateMovie(String id, Movie movie) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setId(id);
        movie.setCreatedAt(existingMovie.getCreatedAt());
        movie.setUpdatedAt(LocalDateTime.now());
        movie.setViewCount(existingMovie.getViewCount());
        movie.setBookingCount(existingMovie.getBookingCount());
        
        return movieRepository.save(movie);
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }

    public Movie incrementViewCount(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setViewCount(movie.getViewCount() + 1);
        return movieRepository.save(movie);
    }

    public Movie incrementBookingCount(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setBookingCount(movie.getBookingCount() + 1);
        return movieRepository.save(movie);
    }
}
