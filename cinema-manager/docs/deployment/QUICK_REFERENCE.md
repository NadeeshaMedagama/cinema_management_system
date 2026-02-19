# 🚀 Quick Deployment Reference Card

## Environment Variables - Quick Look

### Frontend (Vercel)
```
REACT_APP_API_URL = https://your-backend-url.com/api
```

### Backend (Railway/Render/etc.)
```
CORS_ALLOWED_ORIGINS = https://cinema-management-system-tan.vercel.app,http://localhost:3000
```

---

## Your Current URLs

### Frontend
- **Production:** https://cinema-management-system-tan.vercel.app
- **Status:** ✅ Deployed

### Backend
- **Status:** ⚠️ Needs to be deployed
- **Options:** Railway, Render, Heroku

---

## To Do Right Now

1. **Deploy Backend** (Choose one):
   - ✅ Railway: https://railway.app
   - ✅ Render: https://render.com
   - ✅ Heroku: https://heroku.com

2. **Get Backend URL** after deployment
   - Example: `https://cinema-backend.railway.app`

3. **Set in Vercel:**
   ```
   REACT_APP_API_URL = https://cinema-backend.railway.app/api
   ```

4. **Set in Backend:**
   ```
   CORS_ALLOWED_ORIGINS = https://cinema-management-system-pbud-qlh8y0fgo.vercel.app,https://cinema-management-system-tan.vercel.app
   ```

5. **Redeploy Both**

6. **Test:** Visit https://cinema-management-system-tan.vercel.app

---

## One-Liner Answer

**Q: What variable name do I use in the backend for the frontend URL?**

**A: `CORS_ALLOWED_ORIGINS`**

**Q: What variable name do I use in the frontend for the backend URL?**

**A: `REACT_APP_API_URL`**

---

## Files Updated

✅ Backend CORS now uses environment variables
✅ Created ENVIRONMENT_VARIABLES.md
✅ Created DEPLOYMENT_COMPLETE_GUIDE.md
✅ Created .env.production for frontend
✅ Updated .env.example

## Next Steps

Deploy your backend and you're done! 🎉
