# Choreo Quick Reference - Cinema Management System

## 📁 Project Structure

```
Hotel_Management_System/
├── .choreo/
│   ├── component.yaml           # Main Choreo configuration
│   ├── openapi.yaml             # API specification (80+ endpoints)
│   ├── DEPLOYMENT_GUIDE.md      # Complete deployment guide
│   ├── DEPLOYMENT_CHECKLIST.md  # Readiness checklist
│   ├── ENV_TEMPLATE.md          # Environment variables template
│   └── QUICK_REFERENCE.md       # This file
└── cinema-manager/
    └── backend/
        ├── Dockerfile           # Multi-stage Docker build
        ├── pom.xml              # Maven dependencies
        └── src/                 # Application source code
```

## 🚀 Quick Deploy

### 1. Prerequisites
- MongoDB Atlas database created
- Connection string ready
- JWT secret generated (32+ chars)
- Frontend URL for CORS

### 2. Choreo Console Steps

1. **Create Service**
   - Go to https://console.choreo.dev/
   - Click **Create** → **Service**
   - Connect GitHub repository: `Hotel_Management_System`
   - Choreo auto-detects `.choreo/component.yaml`

2. **Add Secrets**
   - Navigate to **Configs & Secrets** → **Secrets**
   - Add these secrets:
     ```
     mongodb-uri
     jwt-secret
     admin-password
     stripe-api-key (optional)
     stripe-public-key (optional)
     stripe-webhook-secret (optional)
     mail-username (optional)
     mail-password (optional)
     ```

3. **Configure Environment**
   - Fill in configuration form:
     ```
     MONGODB_DATABASE=cinema_db
     CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
     SERVER_PORT=8081
     ```

4. **Deploy**
   - Click **Deploy**
   - Wait for build (~3-5 minutes)
   - Get your endpoint URL

5. **Verify**
   ```bash
   curl https://your-choreo-url/actuator/health
   ```

## 📝 Essential Environment Variables

### Secrets (Required)
```bash
mongodb-uri=mongodb+srv://user:pass@cluster.mongodb.net/cinema_db
jwt-secret=your-32-character-or-longer-secret-key
admin-password=admin123
```

### Config Form (Required)
```bash
MONGODB_DATABASE=cinema_db
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### Optional
```bash
# Stripe Payment
stripe-api-key=sk_test_...
stripe-public-key=pk_test_...
stripe-webhook-secret=whsec_...

# Email
mail-username=your-email@gmail.com
mail-password=your-app-password
```

## 🧪 Testing Endpoints

### Health Check
```bash
curl https://your-url/actuator/health
```

### User Signup
```bash
curl -X POST https://your-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### User Login
```bash
curl -X POST https://your-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Movies
```bash
curl https://your-url/api/movies
```

## 🔍 Key Features

### API Endpoints (80+)
- **Authentication**: Signup, Login (User & Admin)
- **Movies**: CRUD, Search, Filters (Now Showing, Coming Soon)
- **Showtimes**: CRUD, By Movie, Upcoming
- **Bookings**: Create, View, Cancel
- **Food & Merchandise**: CRUD, Categories, Combos/Bundles
- **Cart**: Add, Update, Remove, Checkout
- **Payments**: Stripe Integration
- **Users**: Profile Management
- **Contacts**: Form Submission & Management
- **System Config**: Dynamic Configuration

### Security
- JWT authentication
- Role-based access (USER, ADMIN)
- CORS protection
- Password encryption (BCrypt)
- Stateless sessions

### Monitoring
- Health checks: `/actuator/health`
- MongoDB health indicator
- Prometheus metrics
- Docker health check

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check:
- IP whitelist: 0.0.0.0/0 in MongoDB Atlas
- Connection string format
- Database user permissions
```

### CORS Error
```bash
# Fix:
- Add frontend URL to CORS_ALLOWED_ORIGINS
- Format: https://domain.com (no trailing slash)
- Comma-separated for multiple origins
```

### JWT Error
```bash
# Fix:
- JWT secret must be 32+ characters
- Use same secret across all instances
```

### Build Error
```bash
# Check:
- Java 21 available
- All dependencies in pom.xml
- Dockerfile syntax
- Build logs in Choreo console
```

## 📊 API Documentation

Full OpenAPI 3.0 specification available at:
- **File**: `.choreo/openapi.yaml`
- **Endpoint Count**: 80+
- **Controller Count**: 12
- **Schemas**: 15+

## 🔐 Security Checklist

- [ ] JWT secret is strong (32+ chars)
- [ ] Admin password changed from default
- [ ] MongoDB IP whitelist configured
- [ ] CORS origins limited to your domains
- [ ] Secrets stored in Choreo Secrets Manager
- [ ] No secrets in Git repository

## 📞 Support

### Documentation Files
- **Full Guide**: `.choreo/DEPLOYMENT_GUIDE.md`
- **Checklist**: `.choreo/DEPLOYMENT_CHECKLIST.md`
- **Env Template**: `.choreo/ENV_TEMPLATE.md`
- **API Spec**: `.choreo/openapi.yaml`

### Choreo Resources
- Docs: https://wso2.com/choreo/docs/
- Console: https://console.choreo.dev/
- Community: https://discord.gg/wso2

### Application Resources
- Health: `/actuator/health`
- Info: `/actuator/info`
- Metrics: `/actuator/metrics`

## ✅ Success Indicators

Deployment is successful when:
- ✅ Health check returns `{"status": "UP"}`
- ✅ Can signup new user
- ✅ Can login successfully
- ✅ Frontend can connect (no CORS errors)
- ✅ MongoDB operations work
- ✅ JWT tokens are generated

## 🎯 Next Steps After Deployment

1. **Test all endpoints** from frontend
2. **Configure custom domain** (optional)
3. **Set up monitoring alerts** in Choreo
4. **Enable API analytics**
5. **Configure rate limiting** (if needed)
6. **Review logs** regularly
7. **Update admin password**
8. **Add initial data** (movies, showtimes, etc.)

## 📈 Monitoring URLs

```bash
# Health Check
https://your-url/actuator/health

# Health Details (with auth)
https://your-url/actuator/health?show-details=true

# Application Info
https://your-url/actuator/info

# Metrics
https://your-url/actuator/metrics
```

## 🔄 CI/CD

Automatic deployment on Git push:
1. Commit changes to Git
2. Push to GitHub
3. Choreo detects changes
4. Automatic build & deploy
5. Zero-downtime deployment

## 💡 Pro Tips

1. **Use environment-specific configs** - Don't hardcode values
2. **Monitor MongoDB connection pool** - Check actuator metrics
3. **Review logs regularly** - Use Choreo log viewer
4. **Test before deploying** - Run build locally first
5. **Keep secrets secure** - Never commit to Git
6. **Use strong passwords** - Especially for admin
7. **Enable 2FA** - On MongoDB Atlas and Choreo
8. **Backup database** - Regular MongoDB Atlas backups
9. **Version your API** - Plan for future versions
10. **Document changes** - Keep your team informed

---

**Status**: ✅ Ready for Choreo Deployment
**Version**: 1.0.0
**Last Updated**: 2026-02-18
**Platform**: Choreo by WSO2
**Framework**: Spring Boot 3.5.7
