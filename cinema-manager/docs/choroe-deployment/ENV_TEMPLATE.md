# Environment Variables Template for Choreo Deployment

## Secrets (Store in Choreo Secrets Manager)

### MongoDB Connection
mongodb-uri=mongodb+srv://username:password@cluster.mongodb.net/cinema_db?retryWrites=true&w=majority&maxPoolSize=50&minPoolSize=10&maxIdleTimeMS=300000&connectTimeoutMS=30000&socketTimeoutMS=60000

### JWT Authentication
jwt-secret=mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForHS256Algorithm

### Admin Credentials
admin-password=admin123

### Stripe Payment Integration (Optional)
stripe-api-key=sk_test_YOUR_STRIPE_SECRET_KEY
stripe-public-key=pk_test_YOUR_STRIPE_PUBLIC_KEY
stripe-webhook-secret=whsec_YOUR_WEBHOOK_SECRET

### Email Configuration (Optional)
mail-username=your-email@gmail.com
mail-password=your-app-specific-password

## Configuration Form Values (Set during deployment)

### MongoDB
MONGODB_DATABASE=cinema_db

### Server
SERVER_PORT=8081

### JWT
JWT_EXPIRATION=86400000

### CORS (Comma-separated frontend URLs)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://preview-frontend.vercel.app,http://localhost:3000,http://localhost:3001

### Email Server
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

### Application
ADMIN_EMAIL=admin@cinema.com
USER_WELCOME_BONUS=100

### Seating Configuration
SEATS_ROWS=A,B,C,D,E,F,G,H,I,J
SEATS_PER_ROW=10

## Notes

1. **MongoDB URI**: 
   - Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials
   - Whitelist IP: 0.0.0.0/0 in MongoDB Atlas for Choreo access

2. **JWT Secret**: 
   - Must be at least 256 bits (32 characters) for HS256 algorithm
   - Use a strong, random string in production
   - Generate: `openssl rand -base64 32`

3. **Stripe Keys**: 
   - Get from: https://dashboard.stripe.com/apikeys
   - Use test keys for development (sk_test_, pk_test_)
   - Use live keys for production (sk_live_, pk_live_)

4. **Email Configuration**: 
   - For Gmail: Use App-specific password, not your regular password
   - Enable 2FA and generate app password: https://myaccount.google.com/apppasswords

5. **CORS Origins**: 
   - Include ALL frontend URLs (production, preview, local)
   - NO trailing slashes
   - Comma-separated, no spaces

6. **Admin Credentials**: 
   - Change default password immediately after first deployment
   - Use strong password in production (min 12 characters)

## Security Checklist

- [ ] JWT secret is strong and random (32+ characters)
- [ ] Admin password is changed from default
- [ ] MongoDB user has appropriate permissions (readWrite on cinema_db)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Email credentials are app-specific passwords (not main password)
- [ ] Stripe keys match your environment (test vs live)
- [ ] CORS only includes your actual frontend domains
- [ ] All secrets stored in Choreo Secrets Manager (not in code)

## Testing Configuration

After deployment, test with:

```bash
# Health Check
curl https://your-choreo-url/actuator/health

# Test Signup
curl -X POST https://your-choreo-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'

# Test Login
curl -X POST https://your-choreo-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure user has correct permissions
- Test connection from MongoDB Compass

### JWT Issues
- Ensure secret is at least 32 characters
- Use same secret across all instances
- Check for special characters that need escaping

### CORS Issues
- Verify frontend URL is exactly correct
- Check for trailing slashes (should not have them)
- Ensure multiple origins are comma-separated
- No spaces in the origins string

### Email Issues
- Use app-specific password for Gmail
- Check SMTP port (587 for TLS, 465 for SSL)
- Verify mail server allows less secure apps (if applicable)
- Test SMTP connection independently
