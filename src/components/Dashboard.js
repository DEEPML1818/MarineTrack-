
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
        return;
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
        Authorization: stormGlassApiKey,
      },
    })
    .then(response => {
      if (response.data.hours && response.data.hours[0] && response.data.hours[0].waveHeight) {
        const waveData = response.data.hours[0].waveHeight.noaa;
        setWaveHeight(waveData);
        localStorage.setItem('waveHeightData', JSON.stringify(waveData));
        localStorage.setItem('waveHeightTimestamp', Date.now());
      }
    })
    .catch(error => console.error('Error fetching wave height data:', error));
  }, [lat, lon, weatherApiKey, airPollutionApiKey, stormGlassApiKey]);

  const DataCard = ({ title, value, color = "#00f3ff" }) => (
    <div className="glassmorphism rounded-lg p-4 border border-cyan-500/30 hover-lift-cyber">
      <p className="text-xs text-cyan-300/60 mb-2 uppercase tracking-wide">{title}</p>
      <p className="text-xl font-bold" style={{ color }}>{value}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="glassmorphism-card rounded-xl p-8 max-w-6xl mx-auto cyber-border">
          <h2 className="text-4xl font-bold mb-8 text-center neon-text">Weather Dashboard</h2>

          {weather && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-cyan-400 mb-6">Current Weather</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <DataCard 
                  title="Location" 
                  value={`${weather.location.name}, ${weather.location.country}`} 
                />
                <DataCard 
                  title="Temperature" 
                  value={`${weather.current.temp_c}°C`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Feels Like" 
                  value={`${weather.current.feelslike_c}°C`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Condition" 
                  value={weather.current.condition.text} 
                />
                <DataCard 
                  title="Wind Speed" 
                  value={`${weather.current.wind_kph} kph`} 
                  color="#2ec4b6"
                />
                <DataCard 
                  title="Wind Direction" 
                  value={weather.current.wind_dir} 
                  color="#2ec4b6"
                />
                <DataCard 
                  title="Humidity" 
                  value={`${weather.current.humidity}%`} 
                  color="#0099ff"
                />
                <DataCard 
                  title="Pressure" 
                  value={`${weather.current.pressure_mb} mb`} 
                />
                <DataCard 
                  title="UV Index" 
                  value={weather.current.uv} 
                  color="#ff6b6b"
                />
                <DataCard 
                  title="Cloud Cover" 
                  value={`${weather.current.cloud}%`} 
                />
                <DataCard 
                  title="Precipitation" 
                  value={`${weather.current.precip_mm} mm`} 
                  color="#0099ff"
                />
                <DataCard 
                  title="Gust" 
                  value={`${weather.current.gust_kph} kph`} 
                  color="#2ec4b6"
                />
              </div>
            </div>
          )}

          {waveHeight && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-cyan-400 mb-6">Sea Wave Height</h3>
              <div className="glassmorphism rounded-lg p-6 border border-cyan-500/30 text-center">
                <p className="text-2xl font-bold text-purple-400">Wave Height: {waveHeight} meters</p>
              </div>
            </div>
          )}

          {pollutionData && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-cyan-400 mb-6">Air Pollution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DataCard 
                  title="Air Quality Index" 
                  value={pollutionData.list[0].main.aqi} 
                  color="#ff6b6b"
                />
                <DataCard 
                  title="PM2.5" 
                  value={`${pollutionData.list[0].components.pm2_5} µg/m³`} 
                  color="#ff6b6b"
                />
                <DataCard 
                  title="PM10" 
                  value={`${pollutionData.list[0].components.pm10} µg/m³`} 
                  color="#ff6b6b"
                />
                <DataCard 
                  title="Carbon Monoxide (CO)" 
                  value={`${pollutionData.list[0].components.co} µg/m³`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Nitric Oxide (NO)" 
                  value={`${pollutionData.list[0].components.no} µg/m³`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Nitrogen Dioxide (NO2)" 
                  value={`${pollutionData.list[0].components.no2} µg/m³`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Ozone (O3)" 
                  value={`${pollutionData.list[0].components.o3} µg/m³`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Sulfur Dioxide (SO2)" 
                  value={`${pollutionData.list[0].components.so2} µg/m³`} 
                  color="#ff9900"
                />
                <DataCard 
                  title="Ammonia (NH3)" 
                  value={`${pollutionData.list[0].components.nh3} µg/m³`} 
                  color="#ff9900"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
