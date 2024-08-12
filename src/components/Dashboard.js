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
        console.log(waveData);

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
    <div className="relative bg-cover bg-center ">
      <div className="absolute inset-0 bg-black opacity-45"></div>
      <div className="relative z-10 container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Weather Dashboard</h2>

          {weather && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6">Current Weather</h3>
              <div className="flex flex-row flex-wrap justify-center gap-6 mb-6">
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg font-semibold"><strong>Location:</strong> {weather.location.name}, {weather.location.country}</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Temperature:</strong> {weather.current.temp_c}°C</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Feels Like:</strong> {weather.current.feelslike_c}°C</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Condition:</strong> {weather.current.condition.text}</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Wind Speed:</strong> {weather.current.wind_kph} kph</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Wind Direction:</strong> {weather.current.wind_dir}</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Humidity:</strong> {weather.current.humidity}%</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Pressure:</strong> {weather.current.pressure_mb} mb</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>UV Index:</strong> {weather.current.uv}</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Cloud Cover:</strong> {weather.current.cloud}%</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Precipitation:</strong> {weather.current.precip_mm} mm</p>
                </div>
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                  <p className="text-lg"><strong>Gust:</strong> {weather.current.gust_kph} kph</p>
                </div>
              </div>
            </div>
          )}

{waveHeight && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6">Sea Wave Height</h3>
              <div className="flex flex-row flex-wrap justify-center items-center bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-md">
                <p className="text-xl"><strong>Wave Height:</strong> {waveHeight} meters</p>
              </div>
            </div>
          )}

{pollutionData && (
  <div className="mb-8">
    <h3 className="text-3xl font-semibold text-gray-800 mb-6">Air Pollution</h3>
    <div className="flex flex-row flex-wrap justify-center gap-6 mb-6">
      
      {/* AQI */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Air Quality Index</p>
        <p className="text-lg"><strong>AQI:</strong> {pollutionData.list[0].main.aqi}</p>
      </div>

      {/* PM2.5 */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Particle Matter (PM2.5)</p>
        <p className="text-lg"><strong>PM2.5:</strong> {pollutionData.list[0].components.pm2_5} µg/m³</p>
      </div>

      {/* PM10 */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Particle Matter (PM10)</p>
        <p className="text-lg"><strong>PM10:</strong> {pollutionData.list[0].components.pm10} µg/m³</p>
      </div>

      {/* CO */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Carbon Monoxide (CO)</p>
        <p className="text-lg"><strong>CO:</strong> {pollutionData.list[0].components.co} µg/m³</p>
      </div>

      {/* NO */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Nitric Oxide (NO)</p>
        <p className="text-lg"><strong>NO:</strong> {pollutionData.list[0].components.no} µg/m³</p>
      </div>

      {/* NO2 */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Nitrogen Dioxide (NO2)</p>
        <p className="text-lg"><strong>NO2:</strong> {pollutionData.list[0].components.no2} µg/m³</p>
      </div>

      {/* O3 */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Ozone (O3)</p>
        <p className="text-lg"><strong>O3:</strong> {pollutionData.list[0].components.o3} µg/m³</p>
      </div>

      {/* SO2 */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Sulfur Dioxide (SO2)</p>
        <p className="text-lg"><strong>SO2:</strong> {pollutionData.list[0].components.so2} µg/m³</p>
      </div>

      {/* NH3 */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-md">
        <p className='text-xl font-bold'>Ammonia (NH3)</p>
        <p className="text-lg"><strong>NH3:</strong> {pollutionData.list[0].components.nh3} µg/m³</p>
      </div>
    </div>
  </div>
)}  
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
