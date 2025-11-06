# MarineTrack Mobile Application

**Last Updated:** November 3, 2025

## Overview
MarineTrack is a cross-platform mobile application designed for fishermen, seafarers, and small vessel operators to enhance safety, communication, and sustainable fishing at sea. Built with React Native and Expo for web, iOS, and Android platforms.

## Project Purpose
MarineTrack is now a **fully integrated application** with a working backend server enabling real-time vessel tracking, multi-device communication, and persistent data storage.

## Current State
✅ **Completed Features:**
- **Frontend:**
  - Ocean-themed UI design (deep navy, ocean blue, seafoam colors)
  - Complete onboarding flow (3 slides)
  - Authentication screens (login/register)
  - Main dashboard with map placeholder and vessel tracking UI
  - Weather & Navigation screen with forecast display
  - SOS Emergency screen with alert functionality
  - Communication/Chat screen for vessel contacts
  - Settings & Profile screen with sustainable fishing tips
  - Tab-based navigation with 5 main sections
  - Responsive design optimized for mobile and web
  
- **Backend Integration:**
  - Node.js/Express backend server running on port 3000
  - JSON file-based data storage for vessels, users, and messages
  - Real-time Socket.IO support for vessel updates and chat
  - RESTful API endpoints for tracking data
  - Multi-device vessel detection and communication
  - Automatic backend URL configuration for Replit environment
  - Vessel likes and comments system with persistent storage
  - Fishing zone data API with boundary information

## Architecture

### Screen Flow
```
app/
├── index.tsx                    # Entry point (redirects to onboarding)
├── onboarding.tsx              # 3-slide onboarding
├── auth/
│   ├── login.tsx               # Login screen
│   ├── register.tsx            # Registration with vessel info
│   └── _layout.tsx             # Auth navigation
└── (tabs)/
    ├── index.tsx               # Dashboard (map, vessels, weather)
    ├── weather.tsx             # Weather forecasts & alerts
    ├── sos.tsx                 # Emergency SOS
    ├── chat.tsx                # Vessel communication
    ├── settings.tsx            # Profile & settings
    └── _layout.tsx             # Tab navigation
```

### Tech Stack
- **Frontend:** React Native + Expo
- **Backend:** Node.js + Express + Socket.IO
- **Navigation:** Expo Router (file-based routing)
- **Styling:** StyleSheet with themed colors
- **State:** React Hooks (useState)
- **Storage:** JSON file-based database (backend/data/)
- **Real-time:** Socket.IO for live updates
- **Platform:** Web (port 5000), iOS, Android

### Backend Architecture
```
backend/
├── server.js              # Main Express server with Socket.IO
└── data/                  # JSON data storage
    ├── vessels.json       # Vessel tracking data
    ├── users.json         # User accounts
    └── messages.json      # Chat messages

API Endpoints:
- GET    /api/health                      # Health check
- GET    /api/vessels                     # Get all vessels
- GET    /api/vessels/nearby              # Get nearby vessels (with lat/lng/radius)
- POST   /api/tracking                    # Submit vessel location
- POST   /api/users                       # Save/update user data
- GET    /api/messages                    # Get all messages
- POST   /api/messages                    # Send a message
- GET    /api/fishing-zones               # Get fishing zone boundaries
- GET    /api/vessels/:id/likes           # Get likes count for vessel
- POST   /api/vessels/:id/like            # Like a vessel
- DELETE /api/vessels/:id/like            # Unlike a vessel
- GET    /api/vessels/:id/comments        # Get all comments for vessel
- POST   /api/vessels/:id/comments        # Add comment to vessel

Socket.IO Events:
- vessel_location          # Real-time location updates
- vessel_update            # Broadcast vessel changes
- chat_message             # Send chat messages
- new_message              # Broadcast new messages
```

## Features

### 1. Dashboard (Map Screen)
- Live GPS coordinates display
- Interactive OpenStreetMap with vessel markers
- Clickable boat markers showing vessel details
- Fishing zone overlays with color-coded boundaries (green=allowed, red=restricted, orange=danger)
- Nearby vessels list with distance and status
- Weather summary (temperature, wind, waves)
- Quick action buttons (SOS, Weather, Fishing zones)
- **Vessel Interactions:**
  - Like/unlike vessels with real-time counter
  - Add comments to vessels with username and timestamp
  - Tabbed modal interface (Chat, Likes, Comments) for each vessel
  - View all likes and comments from other users

### 2. Weather & Navigation
- Current weather conditions
- Hourly forecast
- Weather alerts
- Safety tips for maritime navigation

### 3. SOS Emergency
- Large emergency button
- GPS location sharing
- Emergency contact list
- Step-by-step emergency instructions

### 4. Communication
- Vessel-to-vessel chat
- Contact list with location tracking
- Message history
- "Last seen" status

### 5. Settings & Profile
- User and vessel information
- Notification preferences
- Emergency contacts management
- Sustainable fishing tips and best practices

## Recent Changes
**November 3, 2025 (Latest Session):**
- ✅ Added vessel likes and comments feature with backend API endpoints
- ✅ Implemented interactive vessel markers on map with click handlers
- ✅ Built tabbed modal interface (Chat, Likes, Comments) for vessel details
- ✅ Added fishing zone overlays to map with color-coded boundaries
- ✅ Fixed import path issues in map component (../../config)
- ✅ Integrated OpenStreetMap component with polygon overlay support
- ✅ Persistent storage for likes/comments in backend/data/ directory

**November 3, 2025 (Earlier):**
- ✅ Integrated Express backend server with Socket.IO
- ✅ Configured backend URL to use localhost:3000 (via .env)
- ✅ Installed socket.io and socket.io-client packages
- ✅ Created JSON file-based storage for multi-device data sharing
- ✅ Set up API endpoints for vessel tracking and messaging
- ✅ Fixed Replit environment configuration for frontend-backend communication
- ✅ Both workflows running: backend-server (port 3000) and expo-app (port 5000)

**October 30, 2025:**
- Created complete app structure with 13 screens
- Implemented ocean-themed color scheme
- Built navigation flow: onboarding → auth → main app
- Added mock data for vessels, weather, contacts
- Configured Expo web workflow on port 5000
- Fixed deprecated shadow style props

## Next Steps for Production

### Backend Integration
1. **Authentication:** Integrate Firebase Authentication or Supabase Auth
   - Implement sign-up/sign-in flows
   - Add session persistence
   - Gate tab navigation behind auth state

2. **Real-time Data:**
   - Add MapView component (react-native-maps)
   - Integrate OpenWeatherMap or StormGlass API for weather
   - Set up vessel tracking with GPS
   - Implement real-time chat with Firebase/Supabase

3. **Emergency Features:**
   - Connect SOS to Twilio for SMS alerts
   - Integrate push notifications (FCM)
   - Add offline data persistence

### Additional Features
- Fishing zone map overlays
- Route planning and navigation
- Vessel history tracking
- Multi-language support
- Offline-first data sync

## User Preferences
- Focus on maritime safety and sustainability
- Ocean-themed visual design
- Simple, intuitive interface for use at sea
- Prototype with mock data for demonstration

## Development Commands
```bash
# Frontend (Expo)
npm start -- --web --port 5000   # Start web development server
npm run android                   # Run on Android
npm run ios                       # Run on iOS

# Backend
cd backend && node server.js     # Start backend server on port 3000
```

## Configuration
- **Frontend Port:** 5000 (Expo web server)
- **Backend Port:** 3000 (Express API server)
- **Backend URL:** Configured via `.env` file (EXPO_PUBLIC_BACKEND_URL=http://localhost:3000)
- **Data Storage:** `backend/data/` directory with JSON files

## Notes
- Backend and frontend run on the same server (localhost communication)
- Vessel tracking data is shared across all devices via backend API
- Real-time updates supported via Socket.IO
- Colors defined in `constants/Colors.ts` for easy theming
- Map component is ready for MapView integration
