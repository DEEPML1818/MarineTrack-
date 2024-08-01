// src/components/WeatherData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/style.css';
import './css/bootstrap.min.css';

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
    <div className="container-fluid pt-4 px-4">
      {weather ? (
        <div className="row g-4">
          {/* Existing Weather Data Display */}
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-thermometer-half fa-3x text-primary"></i> {/* Temperature Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2" style={{fontSize: '35px'}}>Temperature:</p>
                <h6 className="mb-0" style={{fontSize: '40px'}} >{weather.current.temp_c}°C / {weather.current.temp_f}°F</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-feather-alt fa-3x text-primary"></i> {/* Feels Like Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Feels Like:</p>
                <h6 className="mb-0">{weather.current.feelslike_c}°C / {weather.current.feelslike_f}°F</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-wind fa-3x text-primary"></i> {/* Wind Speed Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Wind:</p>
                <h6 className="mb-0">{weather.current.wind_kph} kph / {weather.current.wind_mph} mph</h6>
                <p className="mb-0">Direction: {weather.current.wind_dir} ({weather.current.wind_degree}°)</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-tint fa-3x text-primary"></i> {/* Humidity Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Humidity:</p>
                <h6 className="mb-0">{weather.current.humidity}%</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-cloud fa-3x text-primary"></i> {/* Cloud Cover Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Cloud Cover:</p>
                <h6 className="mb-0">{weather.current.cloud}%</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-umbrella fa-3x text-primary"></i> {/* Precipitation Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Precipitation:</p>
                <h6 className="mb-0">{weather.current.precip_mm} mm / {weather.current.precip_in} in</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-thermometer-three-quarters fa-3x text-primary"></i> {/* Pressure Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Pressure:</p>
                <h6 className="mb-0">{weather.current.pressure_mb} mb / {weather.current.pressure_in} in</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-sun fa-3x text-primary"></i> {/* UV Index Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">UV Index:</p>
                <h6 className="mb-0">{weather.current.uv}</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-exclamation-circle fa-3x text-primary"></i> {/* Gust Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Gust:</p>
                <h6 className="mb-0">{weather.current.gust_kph} kph / {weather.current.gust_mph} mph</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-water fa-3x text-primary"></i> {/* Sea Wave Height Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Sea Wave Height:</p>
                <h6 className="mb-0">{waveHeight} meters</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fas fa-cloud-sun fa-3x text-primary"></i> {/* Weather Condition Icon */}
              <div className="ms-3" style={{height: '100px'}}>
                <p className="mb-2">Condition:</p>
                <h6 className="mb-0">{weather.current.condition.text}</h6>
                <img src={weather.current.condition.icon} alt="Weather condition icon" />
              </div>
            </div>
          </div>

          {/* Air Pollution Data Display */}
          {pollutionData ? (
            <>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-smog fa-3x text-primary"></i> {/* Air Quality Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">AQI:</p>
                    <h6 className="mb-0">{pollutionData.list[0].main.aqi}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-leaf fa-3x text-primary"></i> {/* PM2.5 Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">PM2.5:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.pm2_5} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-leaf fa-3x text-primary"></i> {/* PM10 Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">PM10:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.pm10} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-burn fa-3x text-primary"></i> {/* CO Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">CO:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.co} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-cloud fa-3x text-primary"></i> {/* NO Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">NO:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.no} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-cloud fa-3x text-primary"></i> {/* NO2 Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">NO2:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.no2} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-cloud fa-3x text-primary"></i> {/* O3 Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">O3:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.o3} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-cloud fa-3x text-primary"></i> {/* SO2 Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">SO2:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.so2} µg/m³</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fas fa-cloud fa-3x text-primary"></i> {/* SO2 Icon */}
                  <div className="ms-3" style={{height: '100px'}}>
                    <p className="mb-2">SO2:</p>
                    <h6 className="mb-0">{pollutionData.list[0].components.nh3} NH3:</h6>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading air pollution data...</p>
          )}
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherData;
