# Cinema Management System - Backend

## Overview
This is the backend service for the Cinema Management System, built with Spring Boot. It provides RESTful APIs for managing movies, showtimes, bookings, food/merchandise, and user authentication.

## Technology Stack
- **Java**: 21
- **Spring Boot**: 3.5.7
- **Database**: MongoDB
- **Security**: Spring Security with JWT
- **Payment**: Stripe Integration
- **Build Tool**: Maven

## Project Structure
```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/cinema/managing/system/
│       │       ├── config/          # Configuration classes
│       │       ├── controller/      # REST Controllers
│       │       ├── dto/             # Data Transfer Objects
│       │       ├── model/           # Entity models
│       │       ├── repository/      # MongoDB repositories
│       │       ├── security/        # Security configuration
│       │       └── service/         # Business logic
│       └── resources/
│           └── application.properties
├── pom.xml
└── .env.example
```

## Prerequisites
- Java 21 or higher
- Maven 3.6+
- MongoDB (local or cloud instance)
- Stripe account (for payment processing)

## Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```properties
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/cinema_db
   
   # JWT Configuration
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRATION=86400000
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   
   # Email Configuration (optional)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   ./mvnw clean install
   ```

2. **Run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Alternative: Run with Maven:**
   ```bash
   mvn spring-boot:run
   ```

The backend server will start on `http://localhost:8081`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/{id}` - Get movie by ID
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/{id}` - Update movie (Admin)
- `DELETE /api/movies/{id}` - Delete movie (Admin)

### Showtimes
- `GET /api/showtimes` - Get all showtimes
- `GET /api/showtimes/movie/{movieId}` - Get showtimes by movie
- `POST /api/showtimes` - Create showtime (Admin)
- `PUT /api/showtimes/{id}` - Update showtime (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{userId}` - Get user bookings
- `GET /api/bookings/{id}` - Get booking details

### Food & Merchandise
- `GET /api/food` - Get all food items
- `GET /api/merchandise` - Get all merchandise
- `POST /api/food` - Add food item (Admin)
- `POST /api/merchandise` - Add merchandise (Admin)

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/confirm` - Confirm payment

## Database Initialization

The system includes sample data scripts located in the root directory:
- `add-sample-movies.js` - Add sample movies
- `add-showtimes.js` - Add sample showtimes
- `add-food-items.js` - Add food items
- `add-merchandise-data.js` - Add merchandise data
- `add-sample-data.js` - Complete sample data setup

Run these scripts with Node.js to populate the database with sample data.

## Testing

Run tests with:
```bash
./mvnw test
```

## Building for Production

1. **Create production build:**
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Run the JAR file:**
   ```bash
   java -jar target/cinema-managing-system-0.0.1-SNAPSHOT.jar
   ```

## Configuration

The application uses database-driven configuration. See `CONFIGURATION_GUIDE.md` in the root directory for detailed configuration options.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- Verify network connectivity

### Port Already in Use
- Change the port in `application.properties`:
  ```properties
  server.port=8082
  ```

### JWT Authentication Issues
- Ensure `JWT_SECRET` is properly set
- Check token expiration time

## Documentation

For more detailed documentation, see:
- `DOCUMENTATION_INDEX.md` - Complete documentation index
- `PROJECT_GUIDE.md` - Project overview and architecture
- `CONFIGURATION_GUIDE.md` - Configuration details
- `PAYMENT_INTEGRATION_GUIDE.md` - Payment integration guide

## License

This project is for educational purposes.
