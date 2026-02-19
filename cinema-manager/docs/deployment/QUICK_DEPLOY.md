# 🚀 Quick Deployment Reference

## Project Location
```
/home/nadeeshame/IdeaProjects/Hotel_Management_System/cinema-manager/
```

## 📁 Structure
```
cinema-manager/
├── backend/    → Deploy to Heroku/Railway/Render
├── frontend/   → Deploy to Vercel
└── docs/       → README.md, DEPLOYMENT_GUIDE.md
```

## 🔧 Local Testing

### Start Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on: http://localhost:8081
```

### Start Frontend
```bash
cd frontend
npm install
npm start
# Runs on: http://localhost:3000
```

## 🌐 Deploy Frontend (Vercel)

```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

Set env vars in Vercel dashboard:
- `REACT_APP_API_URL` = backend URL
- `REACT_APP_STRIPE_PUBLIC_KEY` = pk_live_...

## 🖥️ Deploy Backend (Heroku Example)

```bash
cd backend
heroku create cinema-backend-yourname
heroku config:set MONGODB_URI="..."
heroku config:set JWT_SECRET="..."
heroku config:set STRIPE_SECRET_KEY="..."
git push heroku main
```

## 📋 Environment Variables

### Backend
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-256-bit-secret
STRIPE_SECRET_KEY=sk_live_...
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend
```
REACT_APP_API_URL=https://your-backend.herokuapp.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
```

## ✅ Deployment Checklist

- [ ] MongoDB Atlas setup
- [ ] Backend deployed & running
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Stripe keys (production mode)
- [ ] Test signup/login
- [ ] Test booking flow
- [ ] Test payment processing

## 📖 Full Documentation

See **DEPLOYMENT_GUIDE.md** for complete step-by-step instructions!

## 🆘 Quick Troubleshooting

**Backend won't start:**
```bash
heroku logs --tail
# Check MongoDB URI and env vars
```

**Frontend API fails:**
```bash
# Verify REACT_APP_API_URL
console.log(process.env.REACT_APP_API_URL)
# Check backend CORS allows frontend URL
```

**CORS errors:**
- Update backend CORS_ALLOWED_ORIGINS
- Include your Vercel URL
- Redeploy backend

---

**Need Help?** Check DEPLOYMENT_GUIDE.md for detailed instructions!
