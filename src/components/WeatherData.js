// src/components/WeatherData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherData = () => {
  const [weather, setWeather] = useState(null);
  const [waveHeight, setWaveHeight] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const lat = 5.2831; // Labuan latitude
  const lon = 115.2309; // Labuan longitude
  const weatherApiKey = '4d5ea12f38be4e04b8c120842242507';
  const airPollutionApiKey = '94ff7daecfb2522167538d473a405862';
  const stormGlassApiKey = '2d3c71cc-4cf2-11ef-968a-0242ac130004-2d3c7230-4cf2-11ef-968a-0242ac130004';

  useEffect(() => {
    // Fetch general weather data
    axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lon}`)
      .then(response => setWeather(response.data))
      .catch(error => console.error('Error fetching weather data:', error));

    // Fetch air pollution data
    axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${airPollutionApiKey}`)
      .then(response => setPollutionData(response.data))
      .catch(error => console.error('Error fetching air pollution data:', error));

    // Check if wave height data is in localStorage and not outdated
    const cachedWaveData = localStorage.getItem('waveHeightData');
    const cachedTimestamp = localStorage.getItem('waveHeightTimestamp');
    const threeHoursInMs = 3 * 60 * 60 * 1000;

    if (cachedWaveData && cachedTimestamp) {
      const dataAge = Date.now() - cachedTimestamp;
      if (dataAge < threeHoursInMs) {
        setWaveHeight(JSON.parse(cachedWaveData));
        return; // Data is fresh, no need to fetch
      }
    }

    // Fetch sea wave height data
    axios.get(`https://api.stormglass.io/v2/weather/point`, {
      params: {
        lat,
        lng: lon,
        params: 'waveHeight',
        source: 'noaa',
      },
      headers: {
        Authorization: stormGlassApiKey, // Replace with your Storm Glass API key
      },
    })
    
    .then(response => {
      if (response.data.hours && response.data.hours[0] && response.data.hours[0].waveHeight) {
        const waveData = response.data.hours[0].waveHeight.noaa;
        setWaveHeight(waveData);
        console.log(waveData)

        // Store the fetched data and timestamp in localStorage
        localStorage.setItem('waveHeightData', JSON.stringify(waveData));
        localStorage.setItem('waveHeightTimestamp', Date.now());
      } else {
        console.warn('No wave height data available.');
      }
    })
    .catch(error => console.error('Error fetching wave height data:', error));
  }, [lat, lon, weatherApiKey, airPollutionApiKey, stormGlassApiKey]);

  return (
    <div className="relative bg-cover bg-center h-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Weather Data</h2>
          
          {weather && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Current Weather</h3>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-4">
              
                <div className="flex-1">
                  <p className="text-lg text-gray-700"><strong>Location:</strong> {weather.location.name}, {weather.location.country}</p>
                  <p className="text-lg text-gray-700"><strong>Temperature:</strong> {weather.current.temp_c}°C</p>
                  <p className="text-lg text-gray-700"><strong>Feels Like:</strong> {weather.current.feelslike_c}°C</p>
                  <p className="text-lg text-gray-700"><strong>Condition:</strong> {weather.current.condition.text}</p>
                  <p className="text-lg text-gray-700"><strong>Wind Speed:</strong> {weather.current.wind_kph} kph</p>
                  <p className="text-lg text-gray-700"><strong>Wind Direction:</strong> {weather.current.wind_dir}</p>
                  <p className="text-lg text-gray-700"><strong>Humidity:</strong> {weather.current.humidity}%</p>
                  <p className="text-lg text-gray-700"><strong>Pressure:</strong> {weather.current.pressure_mb} mb</p>
                  <p className="text-lg text-gray-700"><strong>UV Index:</strong> {weather.current.uv}</p>
                  <p className="text-lg text-gray-700"><strong>Cloud Cover:</strong> {weather.current.cloud}%</p>
                  <p className="text-lg text-gray-700"><strong>Precipitation:</strong> {weather.current.precip_mm} mm</p>
                  <p className="text-lg text-gray-700"><strong>Gust:</strong> {weather.current.gust_kph} kph</p>
                </div>
              </div>
            </div>
          )}
          
          {waveHeight && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sea Wave Height</h3>
              <p className="text-lg text-gray-700"><strong>Wave Height:</strong> {waveHeight} meters</p>
            </div>
          )}
          
          {pollutionData && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Air Pollution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p className="text-lg text-gray-700"><strong>AQI:</strong> {pollutionData.list[0].main.aqi}</p>
                <p className="text-lg text-gray-700"><strong>PM2.5:</strong> {pollutionData.list[0].components.pm2_5} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>PM10:</strong> {pollutionData.list[0].components.pm10} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>CO:</strong> {pollutionData.list[0].components.co} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>NO:</strong> {pollutionData.list[0].components.no} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>NO2:</strong> {pollutionData.list[0].components.no2} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>O3:</strong> {pollutionData.list[0].components.o3} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>SO2:</strong> {pollutionData.list[0].components.so2} µg/m³</p>
                <p className="text-lg text-gray-700"><strong>NH3:</strong> {pollutionData.list[0].components.nh3} µg/m³</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
