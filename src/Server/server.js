const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'tideData.json');

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

// Start the server on port 3001
app.listen(3001, 'localhost', () => {
  console.log('Server is running on localhost:3001');
  console.log('API Endpoints:');
  console.log('  GET  /api/tide-data - Get current tide data');
  console.log('  POST /api/refresh-tide-data - Manually refresh tide data');
  startPeriodicFetching(); // Start fetching data when the server starts
});