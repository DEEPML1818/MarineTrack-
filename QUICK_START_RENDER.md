# 🚀 Quick Start: Deploy to Render.com

Your Marine Dashboard is now configured for **single-service deployment** on Render.com!

## What Changed?

### ✅ Server Configuration
Your Express server now:
- Serves the built React app in production mode
- Handles all API routes at `/api/*`
- Serves React for all other routes (client-side routing)

### ✅ Package Scripts
- `npm start` → Production mode (runs Express serving React + API)
- `npm run build` → Builds React app for production
- `npm run dev` → Development mode (separate servers - use locally)

## 🎯 Deploy in 3 Steps

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2️⃣ Create Web Service on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 3️⃣ Deploy!
Click "Create Web Service" and wait 5-10 minutes. Done! ✨

## 📱 Your Live App

After deployment, your app will be at:
```
https://your-service-name.onrender.com
```

Everything works from **ONE service**:
- Frontend (React Dashboard)
- Backend (Express API)
- WebSocket connections
- Tide data
- Maritime stats

## 📚 Full Documentation

- **Detailed Guide**: See `RENDER_DEPLOYMENT.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`

## 💡 Quick Tips

1. **Free Tier**: App sleeps after 15 min inactivity (wakes in ~30s)
2. **Auto-Deploy**: Automatically redeploys when you push to GitHub
3. **Logs**: Check Render dashboard for deployment and runtime logs
4. **Upgrade**: $7/mo for always-on service

---

**That's it!** Your full-stack Marine Dashboard deploys as one unified service! 🎉
