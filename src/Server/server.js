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
const fetchInterval = oneDayInMs; // Fetch data every 24 hours
const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

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

// Fetch tide data from the API and write it to the JSON file
const fetchTideDataFromAPI = async () => {
  try {
    console.log('Fetching tide data from API...'); // Debugging log
    const response = await axios.get(`https://www.worldtides.info/api/v2?heights&lat=${lat}&lon=${lon}&key=${apiKey}`);
    console.log('API response:', response.data); // Debugging log
    
    const data = response.data;
    const tideData = {
      heights: data.heights, // Tide heights
      timestamp: Date.now(), // Save the current time to track freshness
      rawData: data // Save the complete API response (optional)
    };

    writeDataToFile(tideData); // Write the data to the JSON file
    return tideData.heights; // Return the heights for the API response
  } catch (error) {
    console.error('Error fetching tide data:', error);
    throw error;
  }
};

// Function to start the periodic fetching of tide data
const startPeriodicFetching = () => {
  // Function to check and fetch data if it is old
  const checkAndFetchData = () => {
    const storedData = readDataFromFile();

    // Fetch new data only if the stored data is old
    if (!storedData || (Date.now() - storedData.timestamp >= oneDayInMs * 2)) {
      console.log('Data is stale or not available, fetching new data.');
      fetchTideDataFromAPI();
    } else {
      console.log('Data is fresh, no need to fetch new data.');
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

// Start the server on port 3001
app.listen(3001, () => {
  console.log('Server is running on port 3001');
  startPeriodicFetching(); // Start fetching data when the server starts
});
