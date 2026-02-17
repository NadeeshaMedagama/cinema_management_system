package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByActiveTrue();
    Category findByName(String name);
}
