# Choreo Deployment Guide - Cinema Management System

## 📋 Overview

This guide will help you deploy the Cinema Management System backend to Choreo platform.

## 🎯 Prerequisites

- Choreo account (https://console.choreo.dev/)
- GitHub repository access
- MongoDB Atlas account with database setup
- Stripe account for payment processing (optional)
- SMTP email credentials (optional)

## 📁 Project Structure

```
Hotel_Management_System/
├── .choreo/
│   ├── component.yaml      # Choreo component configuration
│   └── openapi.yaml        # API specification
└── cinema-manager/
    └── backend/
        ├── Dockerfile      # Container configuration
        ├── pom.xml         # Maven dependencies
        └── src/            # Source code
```

## 🚀 Deployment Steps

### Step 1: Connect Repository to Choreo

1. Log in to Choreo Console: https://console.choreo.dev/
2. Click **Create** → **Service**
3. Select **Buildpack** as the build method
4. Connect your GitHub repository
5. Select the repository: `Hotel_Management_System`
6. Choreo will automatically detect the `.choreo/component.yaml` file

### Step 2: Configure Environment Variables

#### Required Secrets (Store in Choreo Secrets):

1. **MongoDB Configuration**
   - `mongodb-uri`: Your MongoDB Atlas connection string
     ```
     mongodb+srv://username:password@cluster.mongodb.net/cinema_db?retryWrites=true&w=majority
     ```

2. **JWT Configuration**
   - `jwt-secret`: Strong random string (min 256 bits for HS256)
     ```
     mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForHS256Algorithm
     ```

3. **Admin Credentials**
   - `admin-password`: Default admin password
     ```
     admin123
     ```

4. **Stripe Payment Keys** (Optional)
   - `stripe-api-key`: Stripe secret key
   - `stripe-public-key`: Stripe publishable key
   - `stripe-webhook-secret`: Stripe webhook secret

5. **Email Configuration** (Optional)
   - `mail-username`: SMTP username (e.g., your-email@gmail.com)
   - `mail-password`: SMTP password or app-specific password

#### Configuration Form Values:

These will be prompted during deployment:

1. **MONGODB_DATABASE**: `cinema_db` (default)
2. **SERVER_PORT**: `8081` (default)
3. **JWT_EXPIRATION**: `86400000` (24 hours in milliseconds)
4. **CORS_ALLOWED_ORIGINS**: Your frontend URLs (comma-separated)
   ```
   https://your-frontend.vercel.app,http://localhost:3000
   ```
5. **MAIL_HOST**: `smtp.gmail.com` (default)
6. **MAIL_PORT**: `587` (default)
7. **ADMIN_EMAIL**: `admin@cinema.com` (default)
8. **USER_WELCOME_BONUS**: `100` (default loyalty points)
9. **SEATS_ROWS**: `A,B,C,D,E,F,G,H,I,J` (default)
10. **SEATS_PER_ROW**: `10` (default)

### Step 3: Deploy

1. Review the configuration
2. Click **Deploy**
3. Choreo will build the Docker image using the Dockerfile
4. The service will be deployed and a public URL will be provided

### Step 4: Verify Deployment

Once deployed, verify the following endpoints:

1. **Health Check**
   ```bash
   curl https://your-choreo-url.choreoapis.dev/actuator/health
   ```
   Expected response:
   ```json
   {
     "status": "UP",
     "components": {
       "mongodb": {"status": "UP"},
       "diskSpace": {"status": "UP"}
     }
   }
   ```

2. **API Info**
   ```bash
   curl https://your-choreo-url.choreoapis.dev/actuator/info
   ```

3. **Test Authentication**
   ```bash
   curl -X POST https://your-choreo-url.choreoapis.dev/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123",
       "phone": "1234567890"
     }'
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
- **Issue**: `MongoTimeoutException` or connection errors
- **Solution**: 
  - Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
  - Check connection string format
  - Ensure database user has proper permissions

#### 2. CORS Errors
- **Issue**: Frontend can't connect to API
- **Solution**: 
  - Add frontend URL to `CORS_ALLOWED_ORIGINS`
  - Format: `https://frontend.vercel.app,http://localhost:3000`
  - No trailing slashes

#### 3. JWT Token Errors
- **Issue**: `SignatureException` or invalid tokens
- **Solution**: 
  - Ensure `JWT_SECRET` is at least 256 bits (32+ characters)
  - Use the same secret across all instances

#### 4. Build Failures
- **Issue**: Docker build fails
- **Solution**: 
  - Check Java version (requires Java 21)
  - Verify all dependencies in pom.xml
  - Review build logs in Choreo console

#### 5. Health Check Failures
- **Issue**: Service shows unhealthy
- **Solution**: 
  - Check MongoDB connection
  - Verify port 8081 is accessible
  - Review application logs

## 📊 Monitoring

### Health Endpoints

Choreo automatically monitors:
- `/actuator/health` - Overall health status
- `/actuator/health/mongodb` - MongoDB connection
- `/actuator/health/diskspace` - Disk space

### Metrics

Available at `/actuator/metrics`:
- JVM metrics
- HTTP request metrics
- Database connection pool metrics

### Logs

View logs in Choreo Console:
1. Navigate to your service
2. Click **Observability** → **Logs**
3. Filter by severity and time range

## 🔐 Security Best Practices

1. **Never commit secrets** to Git
2. Use **Choreo Secrets** for sensitive data
3. Rotate credentials regularly
4. Use strong passwords (min 12 characters)
5. Enable MongoDB authentication
6. Use HTTPS only in production
7. Keep dependencies updated

## 🔄 CI/CD Integration

Choreo automatically redeploys when you push to your repository:

1. Push changes to GitHub
2. Choreo detects changes
3. Automatically builds and deploys
4. Zero-downtime deployment

## 📝 API Documentation

### OpenAPI Specification

The complete API documentation is available at:
- **File**: `.choreo/openapi.yaml`
- **Interactive Docs**: Available in Choreo Console

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

#### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/now-showing` - Currently showing
- `GET /api/movies/coming-soon` - Coming soon
- `GET /api/movies/{id}` - Movie details

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{userId}` - User bookings
- `GET /api/bookings/{id}` - Booking details

#### Payments
- `POST /api/payments/create-payment-intent` - Stripe payment
- `POST /api/payments/create` - Record payment

### Complete API documentation with all endpoints is in `.choreo/openapi.yaml`

## 🌐 Frontend Integration

Update your frontend environment variables:

```env
REACT_APP_API_URL=https://your-choreo-url.choreoapis.dev
```

Or in Next.js:

```env
NEXT_PUBLIC_API_URL=https://your-choreo-url.choreoapis.dev
```

## 📧 Support

For issues:
1. Check Choreo documentation: https://wso2.com/choreo/docs/
2. Review application logs in Choreo Console
3. Check MongoDB Atlas logs
4. Verify all environment variables are set correctly

## ✅ Deployment Checklist

Before deploying:
- [ ] MongoDB Atlas database created and accessible
- [ ] Connection string tested
- [ ] JWT secret generated (32+ characters)
- [ ] Admin credentials prepared
- [ ] Frontend URL for CORS configured
- [ ] Stripe keys obtained (if using payments)
- [ ] Email SMTP credentials ready (if using email)
- [ ] `.choreo/component.yaml` reviewed
- [ ] `.choreo/openapi.yaml` reviewed
- [ ] Dockerfile tested locally (optional)

After deploying:
- [ ] Health check passes
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Frontend can connect
- [ ] CORS working correctly
- [ ] MongoDB operations successful
- [ ] Monitoring and logs accessible

## 🎉 Success!

Once all checks pass, your Cinema Management System is live on Choreo!

**Next Steps:**
1. Configure custom domain (optional)
2. Set up monitoring alerts
3. Configure rate limiting
4. Enable API analytics in Choreo Console
5. Test all endpoints from frontend

---

**Note**: Keep your secrets secure and never share them publicly!
