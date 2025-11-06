# Marine Dashboard v2 - Real-Time AIS Integration

## Overview
A comprehensive marine monitoring dashboard built with React and Node.js that provides real-time maritime data including:
- **Real-time AIS vessel tracking** via AISstream.io WebSocket API (Malaysian waters)
- Live maritime statistics (Active Vessels, Ports Online, Alerts, Average ETA)
- Real-time weather information via WeatherAPI
- Live tide data with visualizations via Open-Meteo API
- Marine traffic and vessel finder integrations
- Historical shipping data (2023-2024)
- Interactive maps using OpenSeaMap and Leaflet
- Marine news feed

## Project Architecture

### Frontend (React)
- **Framework**: Create React App with React 18.3.1
- **UI Libraries**: 
  - Tailwind CSS for styling
  - Material Tailwind for components
  - Flowbite React for additional components
  - React Icons for iconography
- **Key Features**:
  - Responsive sidebar navigation
  - Multiple data visualization components using Recharts
  - Interactive maps with React Leaflet
  - Routing with React Router DOM
  - Weather data displays
  - Tide data charts
  - Historical AIS data viewing

### Backend (Express + WebSocket)
- **Server**: Node.js Express server (port 3001)
- **Real-Time Data Services**:
  - **AIS Stream Service**: WebSocket connection to aisstream.io for real-time vessel tracking
    - Monitors Malaysian waters (lat: 0-7.5°N, lon: 99-120°E)
    - Tracks 250-400+ vessels in real-time
    - Auto-reconnects with exponential backoff
    - Provides maritime statistics via `/api/maritime-stats` endpoint
  - **Tide Data Service**: Fetches tide/wave data from Open-Meteo API
    - Provides current tide height and forecast
    - 7-day forecast with hourly resolution
    - Caches data to minimize API calls
- **Data Management**: 
  - Real-time WebSocket streaming for AIS data
  - REST API endpoints for frontend consumption
  - CORS enabled for Replit environment
  - Proxy configured in package.json for frontend API calls

### Project Structure
```
├── public/              # Static assets and HTML template
├── src/
│   ├── AIS/            # AIS historical data files
│   ├── asset/          # Images and logos
│   ├── components/     # React components
│   │   ├── CyberHome.js       # Main dashboard with real-time data
│   │   ├── StatsCards.js      # Real-time maritime statistics cards
│   │   ├── AIInsights.js      # AI-powered vessel insights
│   │   ├── Dashboard.js
│   │   ├── WeatherData.js
│   │   ├── TideData.js
│   │   ├── MarineNews.js
│   │   ├── OpenSeaMap.js
│   │   ├── AISDataPage.js
│   │   ├── sidebar.js
│   │   ├── header.js
│   │   └── Footer.js
│   ├── Fonts/          # Custom fonts
│   ├── Server/         # Backend server
│   │   ├── server.js          # Express server with API endpoints
│   │   └── aisStreamService.js # Real-time AIS WebSocket service
│   ├── services/       # Frontend data services
│   │   └── portDataService.js
│   ├── App.js          # Main React app component
│   └── index.js        # Entry point
├── package.json
└── tailwind.config.js
```

## Configuration

### Development Setup
- **Frontend Port**: 5000 (configured for Replit environment)
- **Backend Port**: 3001 (localhost only)
- **Host Configuration**: Frontend allows all hosts to work with Replit's proxy

### Environment Variables
The app uses environment variables for configuration:

**Development (.env.local)**:
- `PORT=5000` - Frontend port
- `HOST=0.0.0.0` - Frontend host (allows Replit proxy)
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Required for Replit iframe proxy
- `BROWSER=none` - Prevents automatic browser opening

**Secrets (via Replit Secrets)**:
- `AISSTREAM_API_KEY` - API key for aisstream.io real-time vessel tracking

## Running the Project

### Development Mode
```bash
npm run dev
```
This runs both the backend server and frontend concurrently.

### Frontend Only
```bash
npm start
```

### Backend Only
```bash
npm run server
```

### Production Build
```bash
npm run build
```

## External APIs

### Real-Time Data Sources
- **AISstream.io** (WebSocket): Real-time vessel tracking via AIS data
  - Filters vessels in Malaysian waters bounding box
  - Provides position updates, vessel details, and navigation data
  - Auto-reconnection with exponential backoff
  - API Key stored in Replit Secrets as `AISSTREAM_API_KEY`

- **Open-Meteo Marine API**: Tide and wave data
  - Current tide height and wave direction
  - 7-day forecast with hourly resolution
  - No API key required (open-source weather API)

- **WeatherAPI.com**: Current weather conditions
  - Temperature, wind speed, and general conditions
  - Updated every request for accurate real-time data

## Recent Changes

### 2025-10-27: Real-Time AIS Integration Complete ✅
- **Integrated AISstream.io**: Live vessel tracking via WebSocket
  - Created `aisStreamService.js` for WebSocket connection management
  - Implemented bounding box filter for Malaysian waters (lat: 0-7.5°N, lon: 99-120°E)
  - Auto-reconnection with exponential backoff (10 retry attempts)
  - Real-time vessel counting: 250-400+ vessels tracked simultaneously
- **API Endpoints**: Added `/api/maritime-stats` endpoint
  - Returns: activeVessels, portsOnline, alerts, avgETA
  - Includes metadata: dataSource, isRealData, connectionStatus, dataAge
  - Fallback to synthetic data if WebSocket disconnected
- **Frontend Integration**: Updated StatsCards and CyberHome components
  - Configured proxy in package.json to forward /api calls to port 3001
  - Simplified URL construction for Replit environment compatibility
  - Real-time data updates every 15 seconds
- **Tide Data Service**: Replaced WorldTides with Open-Meteo API
  - No API key required
  - 7-day forecast with wave height and direction
  - Integrated into `/api/tide-data` endpoint
- **CORS Configuration**: Added proper CORS middleware for Replit proxy
- **Security**: API key stored in Replit Secrets (`AISSTREAM_API_KEY`)

### 2025-10-25: Futuristic CyberPort UI Redesign
- Implemented dark navy gradient background (#001b2e to #00314d) with cyber blue theme
- Created futuristic header with wave icon logo, CyberPort branding, and status bar
- Added glassmorphism design system with neon cyan glow effects
- Created StatsCards component with animated counters
- Created AIInsights component with glowing alerts panel
- Redesigned Footer with Launch Simulation and Export Report buttons
- Added grid overlays and holographic animations
- Implemented CSS animations: glow-pulse, scanline, hover effects

### 2025-10-25: Initial Replit Environment Setup
- Configured frontend to run on port 5000 with 0.0.0.0 host
- Updated backend to explicitly use localhost
- Set up development workflow for concurrent frontend/backend execution
- Added proper host check bypass for Replit proxy compatibility

## User Preferences
None specified yet.

## Notes
- The application embeds third-party marine traffic services (MarineTraffic, VesselFinder)
- Uses static JSON files for AIS historical data
- Tide data is cached and refreshed periodically to minimize API calls
