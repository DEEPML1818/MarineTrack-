
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaWind, FaWater, FaTemperatureHigh, FaEye, FaCompass, FaTint, FaCloudRain, FaSun } from 'react-icons/fa';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

const EnhancedWeatherDashboard = ({ globalSelectedPort }) => {
  const [weather, setWeather] = useState(null);
  const [waveData, setWaveData] = useState(null);
  const [marineForecast, setMarineForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];
  const weatherApiKey = 'b8662263280e4b65a6864833253110';
  const stormGlassApiKey = '5cf7a41a-b626-11f0-a8f4-0242ac130003-5cf7a492-b626-11f0-a8f4-0242ac130003';

  useEffect(() => {
    fetchAllWeatherData();
  }, [selectedPort]);

  const fetchAllWeatherData = async () => {
    setLoading(true);
    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${selectedPort.lat},${selectedPort.lon}`
      );
      setWeather(weatherResponse.data);

      // Fetch marine forecast from StormGlass
      const now = Math.floor(Date.now() / 1000);
      const end = now + 7 * 24 * 60 * 60; // 7 days ahead
      
      const stormGlassResponse = await axios.get(
        'https://api.stormglass.io/v2/weather/point',
        {
          params: {
            lat: selectedPort.lat,
            lng: selectedPort.lon,
            params: 'waveHeight,waveDirection,wavePeriod,swellHeight,swellDirection,swellPeriod,windWaveHeight,seaLevel,waterTemperature,currentSpeed,currentDirection',
            start: now,
            end: end
          },
          headers: {
            Authorization: stormGlassApiKey
          }
        }
      );
      setWaveData(stormGlassResponse.data);

      // Fetch marine forecast
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/marine.json?key=${weatherApiKey}&q=${selectedPort.lat},${selectedPort.lon}&days=3`
      );
      setMarineForecast(forecastResponse.data);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const DataCard = ({ icon: Icon, title, value, unit, color = 'cyan' }) => (
    <div className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 rounded-xl p-4 border border-${color}-400/30`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`text-2xl text-${color}-400`} />
        <span className={`text-xs text-${color}-400/60 uppercase tracking-wide`}>{title}</span>
      </div>
      <p className={`text-2xl font-bold text-${color}-400`}>
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Current Conditions Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-2xl p-6 border border-cyan-400/30">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">
          {selectedPort.name} - Marine & Weather Conditions
        </h2>
        {weather && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <img src={weather.current.condition.icon} alt="weather" className="w-16 h-16 mx-auto" />
              <p className="text-cyan-300 font-semibold">{weather.current.condition.text}</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-cyan-400">{weather.current.temp_c}°</p>
              <p className="text-cyan-400/60">Temperature</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{weather.current.wind_kph}</p>
              <p className="text-blue-400/60">Wind (kph)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-400">{weather.current.humidity}%</p>
              <p className="text-teal-400/60">Humidity</p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Weather Metrics */}
      {weather && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <DataCard icon={FaTemperatureHigh} title="Feels Like" value={weather.current.feelslike_c} unit="°C" color="orange" />
          <DataCard icon={FaWind} title="Wind Speed" value={weather.current.wind_kph} unit="kph" color="blue" />
          <DataCard icon={FaCompass} title="Wind Dir" value={weather.current.wind_dir} unit="" color="indigo" />
          <DataCard icon={FaTint} title="Humidity" value={weather.current.humidity} unit="%" color="teal" />
          <DataCard icon={FaEye} title="Visibility" value={weather.current.vis_km} unit="km" color="purple" />
          <DataCard icon={FaCloudRain} title="Precipitation" value={weather.current.precip_mm} unit="mm" color="blue" />
          <DataCard icon={FaSun} title="UV Index" value={weather.current.uv} unit="" color="yellow" />
          <DataCard icon={FaWind} title="Pressure" value={weather.current.pressure_mb} unit="mb" color="cyan" />
          <DataCard icon={FaWind} title="Gust" value={weather.current.gust_kph} unit="kph" color="blue" />
          <DataCard icon={FaWater} title="Cloud Cover" value={weather.current.cloud} unit="%" color="gray" />
        </div>
      )}

      {/* Marine Data */}
      {waveData && waveData.hours && waveData.hours[0] && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/30">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">Marine Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {waveData.hours[0].waveHeight && (
              <DataCard 
                icon={FaWater} 
                title="Wave Height" 
                value={waveData.hours[0].waveHeight.noaa?.toFixed(2) || 'N/A'} 
                unit="m" 
                color="blue" 
              />
            )}
            {waveData.hours[0].waveDirection && (
              <DataCard 
                icon={FaCompass} 
                title="Wave Dir" 
                value={waveData.hours[0].waveDirection.noaa?.toFixed(0) || 'N/A'} 
                unit="°" 
                color="cyan" 
              />
            )}
            {waveData.hours[0].wavePeriod && (
              <DataCard 
                icon={FaWater} 
                title="Wave Period" 
                value={waveData.hours[0].wavePeriod.noaa?.toFixed(1) || 'N/A'} 
                unit="s" 
                color="teal" 
              />
            )}
            {waveData.hours[0].swellHeight && (
              <DataCard 
                icon={FaWater} 
                title="Swell Height" 
                value={waveData.hours[0].swellHeight.noaa?.toFixed(2) || 'N/A'} 
                unit="m" 
                color="indigo" 
              />
            )}
            {waveData.hours[0].waterTemperature && (
              <DataCard 
                icon={FaTemperatureHigh} 
                title="Water Temp" 
                value={waveData.hours[0].waterTemperature.noaa?.toFixed(1) || 'N/A'} 
                unit="°C" 
                color="orange" 
              />
            )}
            {waveData.hours[0].currentSpeed && (
              <DataCard 
                icon={FaWind} 
                title="Current Speed" 
                value={waveData.hours[0].currentSpeed.noaa?.toFixed(2) || 'N/A'} 
                unit="m/s" 
                color="purple" 
              />
            )}
          </div>
        </div>
      )}

      {/* Marine Forecast */}
      {marineForecast && marineForecast.forecast && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/30">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">3-Day Marine Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marineForecast.forecast.forecastday.map((day, index) => (
              <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-cyan-400/20">
                <p className="text-cyan-300 font-semibold mb-2">{new Date(day.date).toLocaleDateString()}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60">Max Temp:</span>
                    <span className="text-cyan-300">{day.day.maxtemp_c}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60">Min Temp:</span>
                    <span className="text-cyan-300">{day.day.mintemp_c}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60">Max Wind:</span>
                    <span className="text-cyan-300">{day.day.maxwind_kph} kph</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60">Avg Humidity:</span>
                    <span className="text-cyan-300">{day.day.avghumidity}%</span>
                  </div>
                  {day.day.daily_chance_of_rain && (
                    <div className="flex justify-between">
                      <span className="text-cyan-400/60">Rain Chance:</span>
                      <span className="text-cyan-300">{day.day.daily_chance_of_rain}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWeatherDashboard;
