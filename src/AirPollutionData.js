// src/components/AirPollutionData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AirPollutionData = () => {
  const [pollutionData, setPollutionData] = useState(null);
  const lat = 5.2831; // Latitude for the location
  const lon = 115.2309; // Longitude for the location
  const apiKey = 'a79d12a9cf9d78595d7fbbb7e27a7733'; // Your OpenWeatherMap API key

  useEffect(() => {
    axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
      .then(response => setPollutionData(response.data))
      .catch(error => console.error('Error fetching air pollution data:', error));
  }, [lat, lon, apiKey]);

  return (
    
    <div>
      
      {pollutionData ? (
        <div class="col-6">
                          <div class="bg-secondary rounded h-100 p-4">
                              <h6 class="mb-4">Air Pollution Data</h6>
                              <div class="table-responsive">
                                  <table class="table">
                                      <thead>
                                          <tr>
                                              <th scope="col">AQI (Air Quality Index)</th>
                                              <th scope="col">CO:</th>
                                              <th scope="col">NO:</th>
                                              <th scope="col">NO2:</th>
                                              <th scope="col">O3:</th>
                                              <th scope="col">SO2:</th>
                                              <th scope="col">PM2.5:</th>
                                              <th scope="col">PM10:</th>
                                              <th scope="col">NH3:</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <th scope="row"> {pollutionData.list[0].main.aqi}</th>
                                              <td>{pollutionData.list[0].components.co}</td>
                                              <td>{pollutionData.list[0].components.no}</td>
                                              <td>{pollutionData.list[0].components.no2}</td>
                                              <td>{pollutionData.list[0].components.o3}</td>
                                              <td>{pollutionData.list[0].components.so2}</td>
                                              <td>{pollutionData.list[0].components.pm2}</td>
                                              <td>{pollutionData.list[0].components.pm10}</td>
                                              <td>{pollutionData.list[0].components.nh3}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
      ) : (
        <p>Loading air pollution data...</p>
      )}               
    </div>
    
  );
};
export default AirPollutionData;
