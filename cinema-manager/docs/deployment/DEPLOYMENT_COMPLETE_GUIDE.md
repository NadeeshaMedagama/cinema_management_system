# Complete Deployment Guide - Cinema Management System

## Overview
This guide will help you deploy the Cinema Management System with:
- **Frontend**: Vercel (Already deployed at `cinema-management-system-tan.vercel.app`)
- **Backend**: Your choice (Railway, Render, Heroku, etc.)
- **Database**: MongoDB Atlas (Already configured)

---

## Quick Answer to Your Question

### Frontend → Backend
**Variable Name:** `REACT_APP_API_URL`
- **Purpose:** Tells the frontend where the backend API is located
- **Set in:** Vercel Dashboard → Environment Variables
- **Example Value:** `https://cinema-backend.railway.app/api`

### Backend → Frontend (CORS)
**Variable Name:** `CORS_ALLOWED_ORIGINS`
- **Purpose:** Tells the backend which frontend URLs are allowed to make requests
- **Set in:** Backend deployment platform environment variables
- **Example Value:** `https://cinema-management-system-tan.vercel.app,http://localhost:3000`

---

## Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `cinema-manager-backend` repository
   - Select the `backend` directory as root

3. **Set Environment Variables in Railway**
   ```properties
   SERVER_PORT=8081
   MONGODB_URI=mongodb+srv://viduranec21018_db_user:1PT66Tbaga2DGbxL@cluster0.hrph9cw.mongodb.net/?retryWrites=true&w=majority&appName=cinema-managing-system
   MONGODB_DATABASE=cinema_db
   JWT_SECRET=mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForHS256Algorithm
   JWT_EXPIRATION=86400000
   CORS_ALLOWED_ORIGINS=https://cinema-management-system-tan.vercel.app,http://localhost:3000
   ADMIN_EMAIL=admin@cinema.com
   ADMIN_PASSWORD=admin123
   USER_WELCOME_BONUS=100
   SEATS_ROWS=A,B,C,D,E,F,G,H,I,J
   SEATS_PER_ROW=10
   STRIPE_API_KEY=your_stripe_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Copy the generated URL (e.g., `cinema-backend.railway.app`)

### Option B: Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/cinema-managing-system-0.0.1-SNAPSHOT.jar`

3. **Set Environment Variables** (same as Railway above)

4. **Deploy** and copy the URL

---

## Step 2: Update Vercel Frontend

### Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Open your project: `cinema-management-system-tan`

2. **Navigate to Settings**
   - Settings → Environment Variables

3. **Add New Variable**
   ```
   Key: REACT_APP_API_URL
   Value: https://YOUR-BACKEND-URL.railway.app/api
   ```
   (Replace with your actual backend URL)

4. **Apply to All Environments**
   - Select: Production, Preview, Development

5. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## Step 3: Update Backend CORS

If you haven't already deployed the backend, the CORS is now configured to use the environment variable.

1. **Go to Your Backend Deployment Platform**
   - Railway, Render, or Heroku

2. **Add/Update Environment Variable**
   ```
   Key: CORS_ALLOWED_ORIGINS
   Value: https://cinema-management-system-tan.vercel.app,http://localhost:3000
   ```

3. **Redeploy Backend**

---

## Step 4: Test the Deployment

1. **Open Your Frontend**
   - Go to: `https://cinema-management-system-tan.vercel.app`

2. **Open Browser Console**
   - Press F12
   - Go to Console tab

3. **Test Signup/Login**
   - Try to sign up or log in
   - Check console for any errors

4. **Verify API Calls**
   - In Network tab, check that requests go to your backend URL
   - Should see requests to `https://your-backend.railway.app/api/...`
   - NOT `http://localhost:8081/api/...`

---

## Verification Checklist

### Frontend ✓
- [ ] Deployed on Vercel
- [ ] `REACT_APP_API_URL` set in Vercel environment variables
- [ ] Redeployed after setting environment variable
- [ ] Can access the site (no build errors)

### Backend ✓
- [ ] Deployed on Railway/Render/Heroku
- [ ] All environment variables set
- [ ] `CORS_ALLOWED_ORIGINS` includes Vercel URL
- [ ] Backend is running (can access health endpoint)

### Integration ✓
- [ ] Can sign up from production frontend
- [ ] Can log in from production frontend
- [ ] No CORS errors in browser console
- [ ] API calls go to production backend (not localhost)
- [ ] Can view movies, book tickets, etc.

---

## Troubleshooting

### Error: "Network Error" or "Failed to Fetch"
**Problem:** Frontend can't reach backend
**Solution:**
1. Check backend is running
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Redeploy frontend after setting variable

### Error: "CORS Policy" in console
**Problem:** Backend not allowing frontend URL
**Solution:**
1. Add Vercel URL to `CORS_ALLOWED_ORIGINS` in backend
2. Format: `https://cinema-management-system-tan.vercel.app,https://cinema-management-system-pbud-qlh8y0fgo.vercel.app` (no trailing slash)
3. Redeploy backend

### Error: Still connecting to localhost
**Problem:** Environment variable not picked up
**Solution:**
1. Verify variable name is exactly `REACT_APP_API_URL`
2. Check it's applied to "Production" environment
3. Do a fresh redeploy (not just "Redeploy to Production")

### Error: "Cannot POST /api/auth/signup"
**Problem:** Backend route not found or backend not running
**Solution:**
1. Check backend logs for errors
2. Verify backend is running and accessible
3. Test backend directly with Postman/curl

---

## Backend Health Check

Test if your backend is running:

```bash
curl https://YOUR-BACKEND-URL.railway.app/api/health
```

Or visit in browser:
```
https://YOUR-BACKEND-URL.railway.app/api/health
```

Expected response:
```json
{
  "status": "UP",
  "message": "Cinema Management System API is running"
}
```

---

## Summary

**Frontend Environment Variables:**
- `REACT_APP_API_URL` → Backend API URL

**Backend Environment Variables:**
- `CORS_ALLOWED_ORIGINS` → Frontend URL(s)
- Plus all other config (MongoDB, JWT, etc.)

**Deployment Flow:**
1. Deploy Backend → Get Backend URL
2. Set `REACT_APP_API_URL` in Vercel with Backend URL
3. Set `CORS_ALLOWED_ORIGINS` in Backend with Vercel URL
4. Redeploy both
5. Test!

---

## Need Help?

Common commands for testing:

```bash
# Test backend health
curl https://your-backend.railway.app/api/health

# Test login endpoint
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cinema.com","password":"admin123"}'
```

Check the browser console (F12) for detailed error messages!
