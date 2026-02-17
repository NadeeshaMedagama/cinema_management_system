package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Merchandise;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MerchandiseRepository extends MongoRepository<Merchandise, String> {
    List<Merchandise> findByActiveTrue();
    List<Merchandise> findByCategory(String category);
    List<Merchandise> findByCategoryAndActiveTrue(String category);
    List<Merchandise> findByBundleTrue();
    List<Merchandise> findByBundleMovieId(String movieId);
    List<Merchandise> findTop10ByOrderBySalesCountDesc();
}
