# Marine Dashboard v2

## Overview
A comprehensive marine monitoring dashboard built with React and Node.js that provides real-time maritime data including:
- Weather information
- Tide data with visualizations
- AIS (Automatic Identification System) vessel tracking
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

### Backend (Express)
- **Server**: Node.js Express server (port 3001)
- **Purpose**: Fetches tide data from WorldTides API and caches it locally
- **Data Management**: 
  - Periodic data fetching (every 24 hours)
  - Stores tide data in `tideData.json`
  - Hourly freshness checks

### Project Structure
```
├── public/              # Static assets and HTML template
├── src/
│   ├── AIS/            # AIS data files
│   ├── asset/          # Images and logos
│   ├── components/     # React components
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
│   │   ├── server.js
│   │   └── tideData.json
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
The app uses `.env.local` for development configuration:
- `PORT=5000` - Frontend port
- `HOST=0.0.0.0` - Frontend host (allows Replit proxy)
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Required for Replit iframe proxy
- `BROWSER=none` - Prevents automatic browser opening

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
- **WorldTides API**: Provides tide height data for specific coordinates (lat: 5.2831, lon: 115.2309)

## Recent Changes
- 2025-10-25: Futuristic CyberPort UI Redesign
  - Implemented dark navy gradient background (#001b2e to #00314d) with cyber blue theme
  - Created futuristic header with wave icon logo, CyberPort branding, and status bar (LIVE/REPORTS/SETTINGS)
  - Added glassmorphism design system with neon cyan glow effects
  - Created StatsCards component with animated counters (Active Vessels, Ports Online, Alerts, Average ETA)
  - Created AIInsights component with glowing alerts panel
  - Redesigned Footer with Launch Simulation and Export Report buttons
  - Added grid overlays and holographic animations throughout
  - Implemented CSS animations: glow-pulse, scanline, hover effects
  - Note: Main content area needs rendering fix (header renders perfectly, content area blank)

- 2025-10-25: Initial Replit environment setup
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
