package com.example.cinema.managing.system.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.cinema.managing.system.model.Movie;
import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.model.Showtime;
import com.example.cinema.managing.system.model.User;
import com.example.cinema.managing.system.repository.MovieRepository;
import com.example.cinema.managing.system.repository.SeatRepository;
import com.example.cinema.managing.system.repository.ShowtimeRepository;
import com.example.cinema.managing.system.repository.UserRepository;
import com.example.cinema.managing.system.service.SystemConfigService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SystemConfigService systemConfigService;
    
    @Value("${app.admin.default-email:admin@cinema.com}")
    private String adminEmail;
    
    @Value("${app.admin.default-password:admin123}")
    private String adminPassword;
    
    @Value("${app.seats.rows:A,B,C,D,E,F,G,H,I,J}")
    private String seatRowsConfig;

    @Value("${app.seats.per-row:10}")
    private int seatsPerRowConfig;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Initialize system configurations
            System.out.println("Initializing system configurations...");
            systemConfigService.initializeDefaultConfigs();
            System.out.println("System configurations initialized!");

            // Create default admin user if not exists
            if (!userRepository.findByEmail(adminEmail).isPresent()) {
                System.out.println("Creating default admin user...");
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setPhone("1234567890");
                admin.setRole("ADMIN");
                admin.setLoyaltyPoints(0);
                userRepository.save(admin);
                System.out.println("Default admin user created! Email: " + adminEmail + ", Password: " + adminPassword);
            }

            // Check if movies already exist
            if (movieRepository.count() == 0) {
                System.out.println("Initializing sample movie data...");

                // Create sample movies
                Movie movie1 = new Movie();
                movie1.setTitle("Avatar: The Way of Water");
                movie1.setDescription("Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family.");
                movie1.setGenre("Sci-Fi, Adventure");
                movie1.setDuration(192);
                movie1.setRating("PG-13");
                movie1.setDirector("James Cameron");
                movie1.setCast(Arrays.asList("Sam Worthington", "Zoe Saldana", "Sigourney Weaver"));
                movie1.setReleaseDate(LocalDateTime.of(2024, 1, 15, 0, 0));
                movie1.setNowShowing(true);
                movie1.setFeatured(true);
                movie1.setTrailerUrl("https://www.youtube.com/watch?v=d9MyW72ELq0");
                movie1.setPosterUrl("https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg");
                movie1.setLanguage("English");

                Movie movie2 = new Movie();
                movie2.setTitle("Oppenheimer");
                movie2.setDescription("The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.");
                movie2.setGenre("Biography, Drama, History");
                movie2.setDuration(180);
                movie2.setRating("R");
                movie2.setDirector("Christopher Nolan");
                movie2.setCast(Arrays.asList("Cillian Murphy", "Emily Blunt", "Matt Damon"));
                movie2.setReleaseDate(LocalDateTime.of(2024, 2, 1, 0, 0));
                movie2.setNowShowing(true);
                movie2.setFeatured(true);
                movie2.setTrailerUrl("https://www.youtube.com/watch?v=uYPbbksJxIg");
                movie2.setPosterUrl("https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg");
                movie2.setLanguage("English");

                Movie movie3 = new Movie();
                movie3.setTitle("Barbie");
                movie3.setDescription("Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.");
                movie3.setGenre("Comedy, Adventure, Fantasy");
                movie3.setDuration(114);
                movie3.setRating("PG-13");
                movie3.setDirector("Greta Gerwig");
                movie3.setCast(Arrays.asList("Margot Robbie", "Ryan Gosling", "Issa Rae"));
                movie3.setReleaseDate(LocalDateTime.of(2024, 1, 20, 0, 0));
                movie3.setNowShowing(true);
                movie3.setFeatured(false);
                movie3.setTrailerUrl("https://www.youtube.com/watch?v=pBk4NYhWNMM");
                movie3.setPosterUrl("https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg");
                movie3.setLanguage("English");

                Movie movie4 = new Movie();
                movie4.setTitle("Dune: Part Two");
                movie4.setDescription("Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.");
                movie4.setGenre("Sci-Fi, Adventure");
                movie4.setDuration(166);
                movie4.setRating("PG-13");
                movie4.setDirector("Denis Villeneuve");
                movie4.setCast(Arrays.asList("Timothée Chalamet", "Zendaya", "Rebecca Ferguson"));
                movie4.setReleaseDate(LocalDateTime.of(2024, 3, 15, 0, 0));
                movie4.setNowShowing(false);
                movie4.setFeatured(true);
                movie4.setTrailerUrl("https://www.youtube.com/watch?v=Way9Dexny3w");
                movie4.setPosterUrl("https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg");
                movie4.setLanguage("English");

                // Save movies
                movieRepository.saveAll(List.of(movie1, movie2, movie3, movie4));

                System.out.println("Sample movie data initialized successfully!");
            } else {
                System.out.println("Movies already exist in database. Skipping initialization.");
            }

            // Generate seats for all showtimes that don't have seats
            generateSeatsForExistingShowtimes();
        } catch (Exception e) {
            System.err.println("Error initializing data: " + e.getMessage());
            // Don't throw the exception, allow the application to continue
        }
    }

    private void generateSeatsForExistingShowtimes() {
        List<Showtime> allShowtimes = showtimeRepository.findAll();
        int showtimesWithoutSeats = 0;

        for (Showtime showtime : allShowtimes) {
            List<Seat> existingSeats = seatRepository.findByShowtimeId(showtime.getId());

            if (existingSeats.isEmpty()) {
                System.out.println("Generating seats for showtime: " + showtime.getId());
                generateSeats(showtime);
                showtimesWithoutSeats++;
            }
        }

        if (showtimesWithoutSeats > 0) {
            System.out.println("Generated seats for " + showtimesWithoutSeats + " showtime(s)!");
        } else {
            System.out.println("All showtimes already have seats.");
        }
    }

    private void generateSeats(Showtime showtime) {
        List<Seat> seats = new ArrayList<>();
        String[] rows = seatRowsConfig.split(",");
        int seatsPerRow = seatsPerRowConfig;
        
        for (int i = 0; i < rows.length; i++) {
            for (int j = 1; j <= seatsPerRow; j++) {
                Seat seat = new Seat();
                seat.setShowtimeId(showtime.getId());
                seat.setSeatNumber(String.valueOf(j));
                seat.setRow(rows[i]);
                seat.setColumn(j);
                seat.setStatus("AVAILABLE");
                seat.setType("STANDARD");
                seat.setPrice(showtime.getPrice());

                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);
    }
}
