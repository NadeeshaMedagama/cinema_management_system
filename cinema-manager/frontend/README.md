# Cinema Management System - Frontend

## Overview
This is the frontend application for the Cinema Management System, built with React. It provides a user-friendly interface for browsing movies, booking tickets, purchasing food/merchandise, and managing user accounts.

## Technology Stack
- **React**: 18.2.0
- **React Router**: 7.9.6 (for navigation)
- **Axios**: 1.13.2 (for HTTP requests)
- **Stripe React**: 5.6.0 (for payment processing)
- **CSS**: Custom styling

## Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── movie-collage-bg.jpg
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── MovieList.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Food.jsx
│   │   ├── PaymentModal.jsx
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── AdminDashboard.jsx
│   │   ├── AuthPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── MoviesPage.jsx
│   │   └── ...
│   ├── services/          # API service layer
│   │   └── api.js
│   ├── context/           # React Context
│   │   └── AuthContext.js
│   ├── App.js            # Main app component
│   ├── App.css           # Global styles
│   ├── index.js          # Entry point
│   └── index.css         # Base styles
├── package.json
└── .gitignore
```

## Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8081`

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

2. **Configure API endpoint:**
   The frontend is configured to proxy requests to `http://localhost:8081` (see `package.json`).
   
   If your backend runs on a different port, update the `proxy` in `package.json`:
   ```json
   "proxy": "http://localhost:YOUR_BACKEND_PORT"
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

The application will open in your browser at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## Features

### User Features
- **Browse Movies**: View now showing and coming soon movies
- **Movie Details**: Watch trailers, view ratings, and read descriptions
- **Seat Selection**: Interactive seat selection for bookings
- **Food & Merchandise**: Add combos and merchandise to bookings
- **Secure Payments**: Stripe integration for secure checkout
- **User Profile**: View booking history and loyalty points
- **Authentication**: Register and login with JWT authentication

### Admin Features
- **Movie Management**: Add, edit, and delete movies
- **Showtime Management**: Create and manage showtimes
- **Food Management**: Manage food items and combos
- **Merchandise Management**: Manage merchandise inventory
- **User Management**: View and manage users
- **Booking Management**: View all bookings

## Component Overview

### Core Components
- **Navbar**: Navigation bar with authentication state
- **Footer**: Footer with links and information
- **MovieList**: Display grid of movies
- **Login/Signup**: Authentication forms
- **ProtectedRoute**: Route guard for authenticated users

### Feature Components
- **Food**: Food and combo selection
- **PaymentModal**: Stripe payment integration
- **TrailerPlayer**: Embedded video player for trailers
- **ShowtimeManagement**: Admin showtime management
- **MerchandiseManagement**: Admin merchandise management

### Pages
- **Home**: Landing page with featured movies
- **MoviesPage**: Browse all movies
- **MovieDetailsPage**: Individual movie details
- **BookingPage**: Booking and seat selection
- **ProfilePage**: User profile and booking history
- **AdminDashboard**: Admin control panel
- **AuthPage**: Login/Signup page

## Environment Configuration

For Stripe integration, you may need to set environment variables. Create a `.env` file:

```env
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_API_URL=http://localhost:8081/api
```

## API Integration

The frontend communicates with the backend through Axios. API calls are centralized in `src/services/api.js`.

Example API call:
```javascript
import axios from 'axios';

const API_URL = '/api';

export const getMovies = async () => {
  const response = await axios.get(`${API_URL}/movies`);
  return response.data;
};
```

## Authentication

The app uses JWT tokens for authentication. The `AuthContext` manages authentication state:
- Stores user data and token
- Provides login/logout functions
- Persists authentication across page reloads

## Building for Production

1. **Create production build:**
   ```bash
   npm run build
   ```

2. **Serve the build:**
   You can use any static file server. For example, with `serve`:
   ```bash
   npm install -g serve
   serve -s build
   ```

3. **Deploy:**
   The `build` folder can be deployed to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Firebase Hosting

## Styling

The application uses custom CSS with a responsive design. Key styling features:
- Mobile-first responsive design
- Custom color scheme
- Smooth animations and transitions
- Accessibility considerations

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:8081`
- Check CORS configuration in backend
- Verify proxy setting in `package.json`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Payment Integration Issues
- Verify Stripe public key configuration
- Check browser console for Stripe errors
- Ensure backend Stripe configuration is correct

## Documentation

For more details, see:
- `FRONTEND_GUIDE.md` - Detailed frontend documentation
- `PROJECT_GUIDE.md` - Overall project architecture
- `PAYMENT_INTEGRATION_GUIDE.md` - Payment setup guide

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.
