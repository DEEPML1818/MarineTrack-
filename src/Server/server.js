require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AISStreamService = require('./aisStreamService');
const VesselFinderService = require('./vesselFinderService');

const app = express();

// Enhanced CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Add JSON body parser
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../build');
  app.use(express.static(buildPath));
  console.log('Serving React build from:', buildPath);
}
const dataFilePath = path.join(__dirname, 'tideData.json');

// Initialize AIS Stream Service with API keys
const aisApiKey = process.env.AISSTREAM_API_KEY || '786e06e04c50efda09a5075482678ca8b48014fd';
const marineTrafficKey = process.env.MARINETRAFFIC_API_KEY;

let aisService = null;
const vesselFinderService = new VesselFinderService();

if (aisApiKey) {
  console.log('AIS Stream API key found, initializing real-time vessel tracking...');
  if (marineTrafficKey) {
    console.log('MarineTraffic API key found - will use dual data sources for enhanced coverage');
  } else {
    console.log('💡 Add MARINETRAFFIC_API_KEY for enhanced vessel data (sign up free at marinetraffic.com/en/ais-api-services)');
  }
  aisService = new AISStreamService(aisApiKey);
  aisService.connect();
} else {
  console.warn('⚠️  AIS Stream API key not found. Maritime stats will use fallback synthetic data.');
}

console.log('VesselFinder scraping service initialized');

const lat = 5.2831;
const lon = 115.2309;
const stormGlassApiKey = process.env.STORMGLASS_API_KEY || '5cf7a41a-b626-11f0-a8f4-0242ac130003-5cf7a492-b626-11f0-a8f4-0242ac130003';
const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const fetchInterval = oneDayInMs; // Fetch data every 24 hours
const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
const maxDataAge = oneDayInMs; // Consider data stale after 1 day

// Function to read data from the JSON file
const readDataFromFile = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      console.log('Data read from file:', data); // Debugging log
      return JSON.parse(data);
    } else {
      console.log('Data file does not exist.');
      return null;
    }
  } catch (error) {
    console.error('Error reading data from file:', error);
    return null;
  }
};

// Function to write data to the JSON file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data successfully written to file.');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
};

// Fetch tide data from Stormglass.io API
const fetchFromStormglass = async () => {
  console.log('Fetching tide data from Stormglass.io API...');

  const now = new Date();
  const endDate = new Date(now.getTime() + 7 * oneDayInMs);

  const startTimestamp = Math.floor(now.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  const response = await axios.get('https://api.stormglass.io/v2/tide/extremes/point', {
    params: {
      lat,
      lng: lon,
      start: startTimestamp,
      end: endTimestamp
    },
    headers: {
      Authorization: stormGlassApiKey
    }
  });

  console.log('Stormglass API response received successfully');

  const data = response.data;

  // Transform Stormglass data to match our format
  const heights = data.data.map((tide) => ({
    dt: new Date(tide.time).getTime() / 1000,
    date: tide.time,
    height: tide.height || 0,
    type: tide.type // 'high' or 'low'
  }));

  return {
    heights: heights,
    timestamp: Date.now(),
    rawData: data,
    source: 'stormglass.io',
    location: {
      latitude: lat,
      longitude: lon
    }
  };
};

// Fetch tide data from Open-Meteo Marine API
const fetchFromOpenMeteo = async () => {
  console.log('Fetching tide data from Open-Meteo Marine API...');

  const now = new Date();
  const endDate = new Date(now.getTime() + 7 * oneDayInMs);

  const startDateStr = now.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  const response = await axios.get('https://marine-api.open-meteo.com/v1/marine', {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: 'wave_height,wave_direction,wave_period',
      daily: 'wave_height_max',
      timezone: 'Asia/Kuala_Lumpur',
      start_date: startDateStr,
      end_date: endDateStr
    }
  });

  console.log('Open-Meteo API response received successfully');

  const data = response.data;

  // Transform Open-Meteo data to match our format
  const heights = data.hourly.time.map((time, index) => ({
    dt: new Date(time).getTime() / 1000,
    date: time,
    height: data.hourly.wave_height[index] || 0,
    wave_direction: data.hourly.wave_direction[index],
    wave_period: data.hourly.wave_period[index]
  }));

  return {
    heights: heights,
    timestamp: Date.now(),
    rawData: data,
    source: 'open-meteo.com',
    location: {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    }
  };
};

// Fetch tide data with fallback support (tries both APIs)
const fetchTideDataFromAPI = async () => {
  try {
    // Try Open-Meteo first (completely free, unlimited)
    const tideData = await fetchFromOpenMeteo();
    writeDataToFile(tideData);
    return tideData.heights;
  } catch (openMeteoError) {
    console.warn('Open-Meteo API failed:', openMeteoError.message);
    console.log('Falling back to Stormglass.io...');

    try {
      // Fallback to Stormglass (50 calls/day free tier)
      const tideData = await fetchFromStormglass();
      writeDataToFile(tideData);
      return tideData.heights;
    } catch (stormglassError) {
      console.error('Stormglass API also failed:', stormglassError.response?.data || stormglassError.message);
      console.error('Both APIs failed. Using cached data if available.');
      throw new Error('Both tide data APIs failed');
    }
  }
};

// Function to start the periodic fetching of tide data
const startPeriodicFetching = () => {
  // Function to check and fetch data if it is old
  const checkAndFetchData = async () => {
    const storedData = readDataFromFile();
    const now = Date.now();

    // Fetch new data only if the stored data is old (more than 1 day)
    if (!storedData || (now - storedData.timestamp >= maxDataAge)) {
      console.log(`Data is stale or not available (age: ${storedData ? Math.floor((now - storedData.timestamp) / 1000 / 60 / 60) : 'N/A'} hours). Fetching new data...`);
      try {
        await fetchTideDataFromAPI();
        console.log('Successfully fetched fresh tide data.');
      } catch (error) {
        console.error('Failed to fetch new tide data. Using cached data if available.');
      }
    } else {
      const hoursOld = Math.floor((now - storedData.timestamp) / 1000 / 60 / 60);
      console.log(`Data is fresh (${hoursOld} hours old). No need to fetch new data.`);
    }
  };

  // Initial check when the server starts
  checkAndFetchData();

  // Set an interval to fetch new data every 24 hours
  setInterval(checkAndFetchData, fetchInterval);

  // Additional check every hour to ensure data freshness
  setInterval(() => {
    console.log('Hourly check: Verifying if the data is fresh...');
    checkAndFetchData();
  }, oneHourInMs);
};

// Add endpoint to get tide data
app.get('/api/tide-data', (req, res) => {
  const data = readDataFromFile();
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'No tide data available' });
  }
});

// Add endpoint to manually refresh tide data
app.post('/api/refresh-tide-data', async (req, res) => {
  try {
    console.log('Manual refresh requested...');
    await fetchTideDataFromAPI();
    const data = readDataFromFile();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Manual refresh failed:', error);
    res.status(500).json({ error: 'Failed to refresh tide data', message: error.message });
  }
});

// No synthetic data service - using only real AIS data

// Add endpoint to get aggregated maritime statistics - REAL DATA ONLY
app.get('/api/maritime-stats', (req, res) => {
  try {
    const now = Date.now();
    const maxDataAge = 5 * 60 * 1000;

    if (!aisService) {
      return res.json({
        activeVessels: 0,
        portsOnline: 0,
        alerts: 0,
        avgETA: 0,
        dataSource: 'unavailable',
        isRealData: false,
        connectionStatus: 'no_service',
        message: 'AIS service not initialized'
      });
    }

    if (aisService.lastUpdate && (now - aisService.lastUpdate) < maxDataAge) {
      const stats = aisService.getAggregatedStats();
      stats.isRealData = true;

      // Determine primary data source
      if (stats.dataSources && stats.dataSources.length > 0) {
        stats.dataSource = stats.dataSources.join(' + ');
      } else {
        stats.dataSource = 'aisstream.io';
      }

      res.json(stats);
    } else {
      // No real data available
      console.warn(`No real AIS data available (last update: ${aisService.lastUpdate ? Math.floor((now - aisService.lastUpdate) / 1000) + 's ago' : 'never'})`);
      res.json({
        activeVessels: 0,
        portsOnline: 0,
        alerts: 0,
        avgETA: 0,
        dataSource: 'none',
        isRealData: false,
        connectionStatus: aisService.ws?.readyState === 1 ? 'connected_no_data' : 'disconnected',
        message: 'Waiting for real AIS data...'
      });
    }
  } catch (error) {
    console.error('Error getting maritime stats:', error);
    res.status(500).json({ error: 'Failed to get maritime statistics' });
  }
});

// Add endpoint to get live vessel positions
app.get('/api/live-vessels', (req, res) => {
  try {
    let vessels = [];
    let connectionStatus = 'disconnected';

    if (aisService && aisService.ws && aisService.ws.readyState === 1) {
      vessels = aisService.getLiveVessels();
      connectionStatus = 'connected';
    } else {
      connectionStatus = aisService ? 'disconnected' : 'unavailable';
    }

    res.json({
      vessels: vessels,
      count: vessels.length,
      connectionStatus: connectionStatus,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error getting live vessels:', error);
    res.status(500).json({ error: 'Failed to get live vessel data' });
  }
});

// Add endpoint to get individual port statistics - REAL DATA ONLY
app.get('/api/port-stats', (req, res) => {
  try {
    if (!aisService) {
      return res.json({
        error: 'AIS service not available',
        isRealData: false
      });
    }

    const stats = aisService.getPortStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting port stats:', error);
    res.status(500).json({ error: 'Failed to get port statistics' });
  }
});

// VesselFinder endpoints
app.get('/api/vesselfinder/port/:portId', async (req, res) => {
  try {
    const portId = req.params.portId;
    const data = await vesselFinderService.getPortData(portId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching VesselFinder data:', error);
    res.status(500).json({ error: 'Failed to fetch port data' });
  }
});

app.get('/api/vesselfinder/stats/:portId', async (req, res) => {
  try {
    const portId = req.params.portId;
    const stats = vesselFinderService.getPortStats(portId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching VesselFinder stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/vesselfinder/all-stats', async (req, res) => {
  try {
    const allStats = {};
    const portIds = ['labuan', 'port-klang', 'penang', 'johor', 'kuantan', 'bintulu', 'kota-kinabalu', 'kuching'];

    for (const portId of portIds) {
      allStats[portId] = vesselFinderService.getPortStats(portId);
    }

    res.json(allStats);
  } catch (error) {
    console.error('Error fetching all VesselFinder stats:', error);
    res.status(500).json({ error: 'Failed to fetch all stats' });
  }
});

// Catch-all handler to serve React app for client-side routing (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('API Endpoints:');
  console.log('  GET  /api/tide-data - Get current tide data');
  console.log('  POST /api/refresh-tide-data - Manually refresh tide data');
  console.log('  GET  /api/maritime-stats - Get maritime statistics (real-time AIS data)');
  console.log('  GET  /api/port-stats - Get individual port statistics');
  startPeriodicFetching(); // Start fetching tide data when the server starts
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  if (aisService) {
    aisService.disconnect();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  if (aisService) {
    aisService.disconnect();
  }
  process.exit(0);
});