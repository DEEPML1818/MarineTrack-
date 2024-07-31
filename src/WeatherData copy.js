// src/components/WeatherData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherData = () => {
  const [weather, setWeather] = useState(null);
  const lat = 5.2831; // Labuan latitude
  const lon = 115.2309; // Labuan longitude


  useEffect(() => {
    axios.get(`https://api.weatherapi.com/v1/current.json?key=4d5ea12f38be4e04b8c120842242507&q=${lat},${lon}`)
      .then(response => setWeather(response.data))
      .catch(error => console.error('Error fetching weather data:', error));
  }, []);
  console.log(weather);

  return (
    <div>
      {weather && (
        <div>
          <h2>Weather Data</h2>
          <p>Location: {weather.location.name}</p>
          <p>Temperature: {weather.current.temp_c}°C</p>
          <p>Wind Speed: {weather.current.wind_kph} kph</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Sea Wave Height: {weather.current.sea_wave_height} m</p>
        </div>
      )}
    </div>
  );
};

export default WeatherData;
