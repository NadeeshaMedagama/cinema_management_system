package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Movie;
import com.example.cinema.managing.system.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/now-showing")
    public ResponseEntity<List<Movie>> getNowShowing() {
        return ResponseEntity.ok(movieService.getNowShowingMovies());
    }

    @GetMapping("/coming-soon")
    public ResponseEntity<List<Movie>> getComingSoon() {
        return ResponseEntity.ok(movieService.getComingSoonMovies());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Movie>> getFeatured() {
        return ResponseEntity.ok(movieService.getFeaturedMovies());
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Movie>> getPopular() {
        return ResponseEntity.ok(movieService.getMostPopularMovies());
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<List<Movie>> getMostViewed() {
        return ResponseEntity.ok(movieService.getMostViewedMovies());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String q) {
        return ResponseEntity.ok(movieService.searchMovies(q));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Movie>> getByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(movieService.getMoviesByCategory(categoryId));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Movie>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(movieService.getMoviesByGenre(genre));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Movie> incrementView(@PathVariable String id) {
        return ResponseEntity.ok(movieService.incrementViewCount(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.createMovie(movie));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> updateMovie(@PathVariable String id, @RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.updateMovie(id, movie));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build();
    }
}
