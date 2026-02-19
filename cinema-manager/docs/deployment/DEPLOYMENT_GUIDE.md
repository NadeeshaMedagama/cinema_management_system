# Deployment Guide - Cinema Management System

This guide will help you deploy the Cinema Management System to production.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub repository with your code
- ✅ MongoDB Atlas account (or other MongoDB hosting)
- ✅ Stripe account with API keys
- ✅ Vercel account (for frontend)
- ✅ Heroku/Railway/Render account (for backend)

## 🌐 Deployment Architecture

```
┌─────────────┐      HTTPS      ┌──────────────┐
│   Frontend  │ ◄──────────────► │   Backend    │
│   (Vercel)  │                  │ (Heroku/etc) │
└─────────────┘                  └──────────────┘
       │                                 │
       │                                 │
       ▼                                 ▼
┌─────────────┐                  ┌──────────────┐
│   Stripe    │                  │   MongoDB    │
│     API     │                  │    Atlas     │
└─────────────┘                  └──────────────┘
```

## Part 1: Deploy Backend (Spring Boot)

### Option A: Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu/Debian
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku app:**
   ```bash
   cd backend
   heroku create cinema-backend-yourname
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/cinema_db"
   heroku config:set JWT_SECRET="your-256-bit-secret-key-here"
   heroku config:set JWT_EXPIRATION="86400000"
   heroku config:set STRIPE_SECRET_KEY="sk_live_your_stripe_key"
   heroku config:set STRIPE_PUBLIC_KEY="pk_live_your_stripe_key"
   heroku config:set CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"
   ```

5. **Create Procfile in backend directory:**
   ```bash
   echo "web: java -jar target/*.jar" > Procfile
   ```

6. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a cinema-backend-yourname
   git push heroku main
   ```

7. **Verify deployment:**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option B: Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize and deploy:**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Set environment variables in Railway dashboard**

### Option C: Deploy to Render

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: cinema-backend
   - **Root Directory**: backend
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
   - **Instance Type**: Free or Starter

5. Add environment variables in Render dashboard

## Part 2: Deploy Frontend (React) to Vercel

### Step 1: Prepare Frontend

1. **Update API URL in frontend:**
   
   Create `.env.production` in frontend directory:
   ```env
   REACT_APP_API_URL=https://your-backend.herokuapp.com
   REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
   ```

2. **Update package.json:**
   
   Add to `frontend/package.json`:
   ```json
   {
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test",
       "eject": "react-scripts eject"
     }
   }
   ```

### Step 2: Deploy to Vercel

#### Method 1: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? (your account)
   - Link to existing project? No
   - Project name? cinema-frontend
   - Directory? ./
   - Build Command? `npm run build`
   - Output Directory? `build`

#### Method 2: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variables:**
   - `REACT_APP_API_URL` = https://your-backend.herokuapp.com
   - `REACT_APP_STRIPE_PUBLIC_KEY` = pk_live_...

5. Click "Deploy"

### Step 3: Update Backend CORS

After deployment, update backend CORS to allow your Vercel domain:

**In application.properties:**
```properties
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:https://your-frontend.vercel.app}
```

**Or update environment variable:**
```bash
# Heroku
heroku config:set CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"

# Railway (in dashboard)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## Part 3: Setup MongoDB Atlas

1. **Create MongoDB Atlas account:** https://www.mongodb.com/cloud/atlas

2. **Create a cluster:**
   - Choose AWS/GCP/Azure
   - Select a region close to your backend
   - Choose Free tier for testing

3. **Create database user:**
   - Go to Database Access
   - Add new user with password
   - Save credentials securely

4. **Whitelist IP addresses:**
   - Go to Network Access
   - Add IP address: 0.0.0.0/0 (allow from anywhere)
   - Or add specific IPs of your backend servers

5. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

6. **Update backend with MongoDB URI**

## Part 4: Configure Stripe

1. **Get Stripe API keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy "Publishable key" (pk_live_...)
   - Copy "Secret key" (sk_live_...)

2. **Update backend environment:**
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLIC_KEY=pk_live_...
   ```

3. **Update frontend environment:**
   ```bash
   REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
   ```

4. **Setup webhooks (optional):**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-backend.com/api/webhooks/stripe`
   - Select events to listen to

## Part 5: Post-Deployment Checklist

### Backend Verification
- [ ] Backend is accessible: `curl https://your-backend.com/api/movies`
- [ ] MongoDB connection successful
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend domain
- [ ] Stripe keys working

### Frontend Verification
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Can register/login
- [ ] API calls work
- [ ] Stripe checkout works
- [ ] No console errors

### Security Checklist
- [ ] HTTPS enabled on both frontend and backend
- [ ] JWT secret changed from default
- [ ] Stripe using production keys (pk_live_, sk_live_)
- [ ] MongoDB IP whitelist configured
- [ ] `.env` files not committed to Git
- [ ] CORS only allows specific origins

## 🐛 Troubleshooting

### Backend Issues

**Problem: Backend won't start**
```bash
# Check logs
heroku logs --tail

# Common fixes:
# 1. Verify Java version (21)
# 2. Check MongoDB connection string
# 3. Verify all environment variables set
```

**Problem: MongoDB connection failed**
- Check connection string format
- Verify database user credentials
- Check IP whitelist includes backend server IP

### Frontend Issues

**Problem: API calls fail**
```javascript
// Check REACT_APP_API_URL is set correctly
console.log(process.env.REACT_APP_API_URL);

// Verify CORS on backend includes frontend domain
```

**Problem: Vercel build fails**
```bash
# Clear build cache and redeploy
# Or check Node.js version compatibility
```

## 📊 Monitoring

### Backend Monitoring
```bash
# Heroku
heroku logs --tail
heroku ps

# Railway
railway logs

# Render
Check logs in dashboard
```

### Frontend Monitoring
- Vercel Dashboard → Your Project → Deployments
- Check Analytics tab for usage
- Monitor Function logs

## 🔄 Continuous Deployment

### Setup Auto-Deploy

1. **Connect GitHub to Vercel:**
   - Vercel will auto-deploy on git push to main

2. **Connect GitHub to Heroku:**
   ```bash
   # Enable auto-deploy in Heroku dashboard
   # Or use GitHub Actions
   ```

3. **Create GitHub Actions workflow (optional):**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy-frontend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - run: cd frontend && npm install && npm run build
         - uses: amondnet/vercel-action@v20
   ```

## 💰 Cost Estimation

### Free Tier Limits
- **Vercel**: Free for hobby projects
- **Heroku**: Free tier (with limits)
- **MongoDB Atlas**: 512MB free
- **Stripe**: No monthly fees, per-transaction only

### Paid Options (if needed)
- **Vercel Pro**: $20/month
- **Heroku Hobby**: $7/month
- **MongoDB M2**: $9/month
- **Railway**: Usage-based pricing

## 📝 Environment Variables Summary

### Backend
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=86400000
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend
```
REACT_APP_API_URL=https://your-backend.herokuapp.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

---

**Your Cinema Management System is now deployed! 🎉**

Test thoroughly and monitor logs for any issues.
