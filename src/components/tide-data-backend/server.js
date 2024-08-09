const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'tideData.json');

const lat = 5.2831;
const lon = 115.2309;
const apiKey = '995e1ac7-9933-4100-a1cc-d49eb6938a88';
const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Function to read data from the JSON file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

// Function to write data to the JSON file
const writeDataToFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data), 'utf8');
};

// Fetch tide data from the API
const fetchTideDataFromAPI = async () => {
  try {
    const response = await axios.get(`https://www.worldtides.info/api/v2?heights&lat=${lat}&lon=${lon}&key=${apiKey}`);
    const data = response.data;
    const tideData = {
      heights: data.heights,
      timestamp: Date.now()
    };
    writeDataToFile(tideData);
    return tideData.heights;
  } catch (error) {
    console.error('Error fetching tide data:', error);
    throw error;
  }
};

app.get('/api/tides', async (req, res) => {
  try {
    const storedData = readDataFromFile();

    if (storedData && (Date.now() - storedData.timestamp < oneDayInMs * 2)) {
      // Return stored data if it's less than 2 days old
      return res.json(storedData.heights);
    } else {
      // Fetch new data from the API if stored data is old or not available
      const freshData = await fetchTideDataFromAPI();
      return res.json(freshData);
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
