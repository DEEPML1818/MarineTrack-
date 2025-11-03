# ✅ Deployment Checklist for Render.com

## Pre-Deployment Verification

### ✅ Code is Ready
- [x] Express server configured to serve React build in production
- [x] Production start script added (`npm start`)
- [x] Build script configured (`npm run build`)
- [x] All API routes work correctly
- [x] Single service architecture implemented

### ✅ Package.json Scripts
```json
{
  "start": "NODE_ENV=production node ./src/Server/server.js",
  "build": "react-scripts build",
  "dev": "concurrently \"npm run server\" \"npm run start:dev\""
}
```

### ✅ Server Configuration
- [x] Static file serving enabled in production
- [x] Catch-all route for React Router
- [x] PORT environment variable support
- [x] API routes protected (defined before catch-all)

## Render.com Setup

### Step 1: Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access

### Step 2: Create Web Service
- [ ] New Web Service created on Render.com
- [ ] Repository connected
- [ ] Branch selected (usually `main`)

### Step 3: Build & Start Commands
```
Build Command:  npm install && npm run build
Start Command:  npm start
```

### Step 4: Environment Variables (Optional)
- [ ] `AISSTREAM_API_KEY` (if you have one)
- [ ] `MARINETRAFFIC_API_KEY` (if you have one)
- [ ] `STORMGLASS_API_KEY` (if you have one)
- [ ] `NODE_ENV` (automatically set to `production`)

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Verify deployment at provided URL

## Post-Deployment Testing

### Test These Endpoints:
1. **Homepage**: `https://your-app.onrender.com/`
   - Should display Marine Dashboard

2. **Tide Data API**: `https://your-app.onrender.com/api/tide-data`
   - Should return JSON with tide data

3. **Maritime Stats**: `https://your-app.onrender.com/api/maritime-stats`
   - Should return maritime statistics

4. **Port Stats**: `https://your-app.onrender.com/api/port-stats`
   - Should return port data

## Important Notes

⚠️ **Free Tier Limitations**:
- Service spins down after 15 min of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for hobby projects)

💡 **Production Tips**:
- For always-on service, upgrade to Starter ($7/mo)
- Add custom domain in Render settings
- Enable auto-deploy for automatic updates when you push to GitHub
- Monitor logs in Render dashboard for issues

## Architecture

```
Single Node.js Service on Render.com
┌──────────────────────────────────────┐
│  Express Server (PORT from Render)   │
│  ├─ Serves built React files         │
│  ├─ Handles /api/* routes            │
│  └─ Catch-all for React Router       │
└──────────────────────────────────────┘
```

## How Your App Will Work

1. **User visits**: `your-app.onrender.com`
2. **Server**: Serves `build/index.html` and React assets
3. **React**: Loads and handles frontend routing
4. **API calls**: React makes requests to `/api/*` endpoints
5. **Server**: Handles API requests and returns data
6. **React**: Updates UI with the data

Everything runs from **one single service**! 🎉

---

For detailed instructions, see `RENDER_DEPLOYMENT.md`
