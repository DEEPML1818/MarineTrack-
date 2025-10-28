const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AISStreamService = require('./aisStreamService');

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
const dataFilePath = path.join(__dirname, 'tideData.json');

// Initialize AIS Stream Service with API key
const aisApiKey = process.env.AISSTREAM_API_KEY;
let aisService = null;

if (aisApiKey) {
  console.log('AIS Stream API key found, initializing real-time vessel tracking...');
  aisService = new AISStreamService(aisApiKey);
  aisService.connect();
} else {
  console.warn('⚠️  AIS Stream API key not found. Maritime stats will use fallback synthetic data.');
}

const lat = 5.2831;
const lon = 115.2309;
const stormGlassApiKey = '27716680-b17d-11f0-b4de-0242ac130003-27716702-b17d-11f0-b4de-0242ac130003';
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

// Port statistics service
class PortStatsService {
  constructor() {
    this.currentStats = {};
    this.lastUpdate = null;
    this.updateInterval = 15000;
  }

  portVesselCounts = {
    'labuan': { min: 20, max: 35 },
    'port-klang': { min: 150, max: 220 },
    'penang': { min: 80, max: 120 },
    'johor': { min: 120, max: 180 },
    'kuantan': { min: 35, max: 60 },
    'bintulu': { min: 50, max: 80 },
    'kota-kinabalu': { min: 25, max: 50 },
    'kuching': { min: 30, max: 55 }
  };

  generatePortStats() {
    const stats = {};
    const now = Date.now();

    Object.keys(this.portVesselCounts).forEach(portId => {
      const portData = this.portVesselCounts[portId];
      const activeVessels = Math.floor(Math.random() * (portData.max - portData.min + 1)) + portData.min;
      const docked = Math.floor(activeVessels * 0.6) + Math.floor(Math.random() * 5);
      const incoming = Math.floor(activeVessels * 0.2) + Math.floor(Math.random() * 3);
      const outgoing = Math.floor(activeVessels * 0.15) + Math.floor(Math.random() * 3);
      
      stats[portId] = {
        activeVessels: activeVessels,
        incoming: incoming,
        outgoing: outgoing,
        docked: docked,
        capacity: 70 + Math.floor(Math.random() * 25),
        alerts: Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 1 : 0
      };
    });

    this.currentStats = stats;
    this.lastUpdate = now;
    return stats;
  }

  getAllPortStats() {
    const now = Date.now();
    
    if (!this.lastUpdate || (now - this.lastUpdate) >= this.updateInterval) {
      this.generatePortStats();
    }

    return this.currentStats;
  }

  getAggregatedStats() {
    const portStats = this.getAllPortStats();
    let totalActiveVessels = 0;
    let totalIncoming = 0;
    let totalOutgoing = 0;
    let totalAlerts = 0;
    let portsOnline = 0;

    Object.keys(portStats).forEach(portId => {
      const port = portStats[portId];
      totalActiveVessels += port.activeVessels;
      totalIncoming += port.incoming;
      totalOutgoing += port.outgoing;
      totalAlerts += port.alerts;
      portsOnline++;
    });

    const avgETA = totalIncoming > 0 ? (3.5 + Math.random() * 2).toFixed(1) : 0;

    return {
      activeVessels: totalActiveVessels,
      portsOnline: portsOnline,
      alerts: totalAlerts,
      avgETA: parseFloat(avgETA),
      lastUpdate: this.lastUpdate
    };
  }
}

const portStatsService = new PortStatsService();

// Add endpoint to get aggregated maritime statistics
app.get('/api/maritime-stats', (req, res) => {
  try {
    let stats;
    const now = Date.now();
    const maxDataAge = 5 * 60 * 1000;
    
    if (aisService && aisService.lastUpdate && (now - aisService.lastUpdate) < maxDataAge) {
      stats = aisService.getAggregatedStats();
      stats.dataSource = 'aisstream.io';
      stats.isRealData = true;
      stats.connectionStatus = aisService.ws && aisService.ws.readyState === 1 ? 'connected' : 'disconnected';
    } else {
      if (aisService && aisService.lastUpdate && (now - aisService.lastUpdate) >= maxDataAge) {
        console.warn(`AIS data is stale (age: ${Math.floor((now - aisService.lastUpdate) / 1000)}s), using fallback`);
      }
      stats = portStatsService.getAggregatedStats();
      stats.dataSource = 'simulated';
      stats.isRealData = false;
      stats.connectionStatus = aisService ? 'stale' : 'unavailable';
      console.log('Using fallback synthetic data (AIS stream not available or stale)');
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting maritime stats:', error);
    res.status(500).json({ error: 'Failed to get maritime statistics' });
  }
});

// Add endpoint to get individual port statistics
app.get('/api/port-stats', (req, res) => {
  try {
    let stats;
    
    if (aisService && aisService.lastUpdate) {
      stats = aisService.getPortStats();
    } else {
      stats = portStatsService.getAllPortStats();
      console.log('Using fallback synthetic port data (AIS stream not available)');
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting port stats:', error);
    res.status(500).json({ error: 'Failed to get port statistics' });
  }
});

// Start the server on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
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