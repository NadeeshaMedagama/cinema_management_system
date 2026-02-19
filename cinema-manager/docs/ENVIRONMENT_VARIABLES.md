# Environment Variables Configuration

## Frontend Environment Variables

### For Local Development (.env.local)
```env
REACT_APP_API_URL=http://localhost:8081/api
```

### For Vercel Production Deployment
Set these in **Vercel Dashboard → Project Settings → Environment Variables**:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Example:**
```env
REACT_APP_API_URL=https://cinema-backend.railway.app/api
```

---

## Backend Environment Variables

### For Local Development (.env or application.properties)
```properties
# Server Configuration
SERVER_PORT=8081

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=cinema_db

# JWT Configuration
JWT_SECRET=mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForHS256Algorithm
JWT_EXPIRATION=86400000

# CORS Configuration - Frontend URL(s)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Admin Configuration
ADMIN_EMAIL=admin@cinema.com
ADMIN_PASSWORD=admin123

# User Configuration
USER_WELCOME_BONUS=100

# Seat Configuration
SEATS_ROWS=A,B,C,D,E,F,G,H,I,J
SEATS_PER_ROW=10

# Stripe Payment Configuration
STRIPE_API_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### For Production Deployment
Set these in your deployment platform (Railway, Heroku, etc.):

```properties
# Server Configuration
SERVER_PORT=8081

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=cinema_db

# JWT Configuration
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRATION=86400000

# CORS Configuration - Add your Vercel frontend URL
CORS_ALLOWED_ORIGINS=https://cinema-management-system-tan.vercel.app,http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@cinema.com
ADMIN_PASSWORD=SecurePassword123!

# User Configuration
USER_WELCOME_BONUS=100

# Seat Configuration
SEATS_ROWS=A,B,C,D,E,F,G,H,I,J
SEATS_PER_ROW=10

# Stripe Payment Configuration
STRIPE_API_KEY=sk_live_your_actual_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_actual_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## Quick Reference

### Frontend → Backend Communication
- **Frontend Variable:** `REACT_APP_API_URL`
- **Value:** Backend API base URL
- **Example:** `https://cinema-backend.railway.app/api`

### Backend → Frontend CORS
- **Backend Variable:** `CORS_ALLOWED_ORIGINS`
- **Value:** Comma-separated list of allowed frontend URLs
- **Example:** `https://cinema-management-system-tan.vercel.app,https://cinema-management-system-pbud-qlh8y0fgo.vercel.app,http://localhost:3000`

---

## Deployment Checklist

### Frontend (Vercel)
1. ✅ Set `REACT_APP_API_URL` in Vercel Environment Variables
2. ✅ Redeploy after setting environment variables

### Backend (Railway/Heroku/etc.)
1. ✅ Set `CORS_ALLOWED_ORIGINS` to include your Vercel frontend URL
2. ✅ Set all other required environment variables
3. ✅ Redeploy after setting environment variables

### Testing
1. ✅ Test login/signup from production frontend
2. ✅ Check browser console for CORS errors
3. ✅ Verify API calls are going to production backend (not localhost)

---

## Common Issues

### Issue: "CORS Error" in browser console
**Solution:** Add your frontend URL to `CORS_ALLOWED_ORIGINS` in backend environment variables

### Issue: Frontend still connecting to localhost
**Solution:** Set `REACT_APP_API_URL` in Vercel and redeploy

### Issue: 404 Not Found on API calls
**Solution:** Check that backend is deployed and running, verify the API URL is correct
