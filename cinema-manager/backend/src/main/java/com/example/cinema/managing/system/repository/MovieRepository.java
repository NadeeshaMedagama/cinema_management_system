package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    List<Movie> findByNowShowingTrueOrderByBookingCountDesc();
    List<Movie> findByComingSoonTrue();
    List<Movie> findByFeaturedTrue();
    List<Movie> findByCategoryId(String categoryId);
    List<Movie> findByGenre(String genre);
    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findTop10ByOrderByViewCountDesc();
    List<Movie> findTop10ByOrderByBookingCountDesc();
}
