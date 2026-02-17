# Cinema Management System

A full-stack web application for managing cinema operations including movie browsing, ticket booking, food/merchandise purchases, and admin management. Built with **Spring Boot** (backend) and **React** (frontend).

## 🎬 Project Overview

This system provides a complete solution for cinema operations with:
- **User-facing features**: Movie browsing, seat booking, food ordering, secure payments
- **Admin features**: Movie/showtime management, inventory management, user management
- **Secure authentication**: JWT-based authentication with role-based access control
- **Payment processing**: Integrated Stripe payment gateway

## 📁 Project Structure

```
cinema-manager/
├── backend/          # Spring Boot backend (Java)
├── frontend/         # React frontend
├── README.md         # This file
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── vercel.json       # Vercel deployment configuration
```

## 🚀 Technology Stack

### Backend
- Java 21
- Spring Boot 3.5.7
- MongoDB (Database)
- Spring Security (Authentication)
- JWT (Token-based auth)
- Stripe API (Payment processing)
- Maven (Build tool)

### Frontend
- React 18.2.0
- React Router 7.9.6
- Axios 1.13.2
- Stripe React 5.6.0
- CSS3 (Styling)

## 📋 Features

### User Features
✅ Browse movies (now showing & coming soon)  
✅ View movie details with trailers  
✅ Interactive seat selection  
✅ Food and merchandise ordering  
✅ Secure payment with Stripe  
✅ Booking history & management  
✅ User profile with loyalty points  

### Admin Features
✅ Movie management (CRUD operations)  
✅ Showtime scheduling  
✅ Food & merchandise inventory  
✅ User management  
✅ Booking overview  
✅ System configuration  

## 🔧 Local Development Setup

### Prerequisites
- Java 21+
- Node.js 16+
- MongoDB (local or cloud)
- Maven 3.6+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, Stripe keys
   ```

3. **Run the backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend will run on: `http://localhost:8081`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   Frontend will run on: `http://localhost:3000`

## 🌐 Deployment

### Deploying Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard:**
   - `REACT_APP_API_URL` - Your backend API URL
   - `REACT_APP_STRIPE_PUBLIC_KEY` - Your Stripe public key

### Deploying Backend

The Spring Boot backend can be deployed to:

#### Option 1: Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-cinema-backend

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set STRIPE_SECRET_KEY="your-stripe-key"

# Deploy
git subtree push --prefix backend heroku main
```

#### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

#### Option 3: Render
1. Connect your GitHub repository
2. Create a new Web Service
3. Select the `backend` directory
4. Set build command: `./mvnw clean package -DskipTests`
5. Set start command: `java -jar target/*.jar`
6. Add environment variables

### Environment Variables

#### Backend (.env)
```properties
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cinema_db
JWT_SECRET=your_secret_key_min_256_bits
JWT_EXPIRATION=86400000
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

#### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend.herokuapp.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/{id}` - Get movie details
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/{id}` - Update movie (Admin)
- `DELETE /api/movies/{id}` - Delete movie (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{userId}` - Get user bookings

### Payments
- `POST /api/payment/create-payment-intent` - Initiate payment
- `POST /api/payment/confirm` - Confirm payment

## 🔐 Security Notes

⚠️ **Important for Production:**
1. Change default JWT secret (min 256 bits)
2. Use strong passwords
3. Enable HTTPS
4. Use production Stripe keys
5. Configure proper CORS origins
6. Enable rate limiting
7. Set up proper logging and monitoring
8. Never commit `.env` files to Git

## 📦 Building for Production

### Backend
```bash
cd backend
./mvnw clean package -DskipTests
# Output: target/cinema-managing-system-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output: build/ directory
```

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Failed**: Check URI format and network connectivity
- **Port Already in Use**: Change port in `application.properties`
- **JWT Authentication Failed**: Verify JWT secret is set correctly

### Frontend Issues
- **API Connection Failed**: Verify backend URL in environment variables
- **CORS Errors**: Check backend CORS configuration includes frontend URL
- **Build Errors**: Clear cache with `rm -rf node_modules && npm install`

### Deployment Issues
- **Vercel Build Failed**: Check Node.js version compatibility
- **Backend Not Starting**: Check logs for startup errors
- **Database Connection**: Verify MongoDB connection string and IP whitelist

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review deployment logs
- Verify environment variables are set correctly

---

**Happy Coding! 🎬🍿**
