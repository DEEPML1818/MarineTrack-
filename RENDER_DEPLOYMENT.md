# Render.com Deployment Guide

This guide will help you deploy your Marine Dashboard application as a **single service** on Render.com, running both frontend and backend together.

## 🚀 Quick Deploy Steps

### 1. Push Your Code to GitHub
First, make sure your code is pushed to a GitHub repository.

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to [Render.com](https://render.com/) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your Marine Dashboard repository

### 3. Configure Your Web Service

Use these exact settings:

| Setting | Value |
|---------|-------|
| **Name** | `marine-dashboard` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or paid for better performance) |

### 4. Environment Variables (Optional)

Add these environment variables if you have API keys:

- `NODE_ENV` = `production` (automatically set by Render)
- `AISSTREAM_API_KEY` = Your AIS Stream API key (optional)
- `MARINETRAFFIC_API_KEY` = Your Marine Traffic API key (optional)
- `STORMGLASS_API_KEY` = Your Storm Glass API key (optional)

To add environment variables:
1. Go to your service's **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Enter the key and value
4. Click **"Save Changes"**

### 5. Deploy!

Click **"Create Web Service"** and Render will:
1. Install dependencies (`npm install`)
2. Build your React app (`npm run build`)
3. Start the Express server serving both API and frontend (`npm start`)

Your app will be live at: `https://your-service-name.onrender.com`

## 📝 How It Works

### Single Service Architecture

```
┌─────────────────────────────────────┐
│     Render.com Web Service          │
│  (One single Node.js instance)      │
├─────────────────────────────────────┤
│                                     │
│  Express Server (PORT 3001/10000)   │
│  ├── Serves React build files       │
│  ├── API routes (/api/*)            │
│  └── Catch-all for React Router     │
│                                     │
└─────────────────────────────────────┘
```

### Production vs Development

**Development Mode** (Local - Replit):
- `npm run dev` → Runs both servers separately
  - React dev server on port 5000
  - Express API server on port 3001

**Production Mode** (Render):
- `npm start` → Runs single Express server
  - Serves pre-built React files from `/build`
  - Handles API requests at `/api/*`
  - Serves React app for all other routes

## 🔧 Scripts Explained

- `npm run build` - Builds React app into `build/` folder
- `npm start` - Runs Express server in production mode (serves built React + API)
- `npm run dev` - Development mode (runs separate React dev server + API server)

## ✅ Verify Deployment

After deployment, test these endpoints:

1. **Frontend**: `https://your-app.onrender.com/` → Should show your dashboard
2. **API Health**: `https://your-app.onrender.com/api/tide-data` → Should return JSON data
3. **Stats**: `https://your-app.onrender.com/api/maritime-stats` → Should return stats

## 🐛 Troubleshooting

### Build Fails
- Check Render logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### App Shows "Cannot GET /"
- Check that `npm run build` completed successfully
- Verify the `build/` directory exists after build
- Check server logs for path errors

### API Routes Not Working
- Ensure API routes are defined before the catch-all route
- Check CORS settings if needed
- Verify environment variables are set correctly

### Free Tier Sleeps
- Render's free tier spins down after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Consider paid tier for always-on service

## 💰 Pricing

- **Free Tier**: 750 hours/month, spins down after inactivity
- **Starter**: $7/month, always on, better performance
- **Standard**: $25/month, more resources

## 🔄 Auto-Deploy

Once set up, Render automatically deploys when you push to your GitHub repository:

```bash
git add .
git commit -m "Update dashboard"
git push origin main
# ✨ Render automatically rebuilds and deploys
```

## 📊 Monitoring

Access your service's dashboard on Render to see:
- Deployment logs
- Runtime logs
- Metrics (CPU, memory, response times)
- Custom domain setup
- Environment variables

## 🌐 Custom Domain (Optional)

1. Go to your service's **"Settings"** tab
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Follow the DNS configuration instructions

---

**That's it!** Your Marine Dashboard is now running as a single, unified service on Render.com! 🎉
