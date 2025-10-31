
import React, { useState, useEffect } from 'react';
import { FaGlobe, FaWater, FaCloudSun, FaShip, FaAnchor } from 'react-icons/fa';
import axios from 'axios';
import StatsCards from './StatsCards';
import AIInsights from './AIInsights';
import OpenSeaMap from './OpenSeaMap';
import MalaysianPortsStats from './MalaysianPortsStats';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

const CyberHome = ({ globalSelectedPort }) => {
  const [weather, setWeather] = useState(null);
  const [tideData, setTideData] = useState(null);
  const [vesselCount, setVesselCount] = useState(0);
  const [vesselData, setVesselData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [dataSource, setDataSource] = useState('unknown');
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];

  useEffect(() => {
    // Fetch real-time weather data for selected port
    const fetchWeather = async () => {
      try {
        const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY || '';
        if (!weatherApiKey) {
          console.warn('Weather API key not configured');
          return;
        }
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${selectedPort.lat},${selectedPort.lon}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    
    // Fetch real port-specific vessel data
    const fetchPortData = async () => {
      try {
        const response = await fetch('/api/port-stats');
        const data = await response.json();
        
        if (data && data[globalSelectedPort]) {
          const portData = data[globalSelectedPort];
          setVesselCount(portData.activeVessels || 0);
          setVesselData(portData);
          setConnectionStatus(portData.activeVessels > 0 ? 'connected' : 'no_data');
          setDataSource(portData.isRealData ? 'Real AIS Data' : 'No Data');
        } else {
          setVesselCount(0);
          setVesselData(null);
          setConnectionStatus('no_data');
          setDataSource('No Data');
        }
      } catch (error) {
        console.error('Error fetching port data:', error);
        setConnectionStatus('error');
      }
    };

    // Fetch real-time tide data
    const fetchTideData = async () => {
      try {
        const response = await fetch('/api/tide-data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTideData(data);
      } catch (error) {
        console.error('Error fetching tide data:', error);
      }
    };

    // Fetch real-time vessel data from API
    const fetchVesselData = async () => {
      try {
        const response = await fetch('/api/maritime-stats');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const maritimeStats = await response.json();
        setVesselCount(maritimeStats.activeVessels);
        setConnectionStatus(maritimeStats.connectionStatus || 'unknown');
        setDataSource(maritimeStats.dataSource || 'unknown');
        
        // No mock data - only use real vessel data from the API
        setVesselData(maritimeStats);
      } catch (error) {
        console.error('Error fetching vessel data:', error);
        setVesselCount(0);
      }
    };

    fetchWeather();
    fetchTideData();
    fetchVesselData();

    // Refresh data every 30 seconds for weather, 60 seconds for tide, 15 seconds for vessels
    const weatherInterval = setInterval(fetchWeather, 30000);
    const tideInterval = setInterval(fetchTideData, 60000);
    const vesselInterval = setInterval(fetchVesselData, 15000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(tideInterval);
      clearInterval(vesselInterval);
    };
  }, [selectedPort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridScroll 20s linear infinite'
        }} />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header Section with Real-Time Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Maritime Intelligence Hub
              </h1>
              <p className="text-cyan-400/70 text-lg">
                Real-Time Port Operations - {selectedPort.name}
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-6 py-3 rounded-xl border ${
              connectionStatus === 'connected' 
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' 
                : connectionStatus === 'stale' || connectionStatus === 'disconnected'
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
                : 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-400/30'
            }`}>
              <span className="relative flex h-3 w-3">
                {connectionStatus === 'connected' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </>
                )}
                {(connectionStatus === 'stale' || connectionStatus === 'disconnected') && (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                )}
                {connectionStatus === 'unavailable' && (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                )}
              </span>
              <span className={`font-semibold ${
                connectionStatus === 'connected' 
                  ? 'text-green-400' 
                  : connectionStatus === 'stale' || connectionStatus === 'disconnected'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>
                {connectionStatus === 'connected' && dataSource === 'aisstream.io' && 'LIVE AIS DATA'}
                {connectionStatus === 'connected' && dataSource !== 'aisstream.io' && 'LIVE DATA FEED'}
                {(connectionStatus === 'stale' || connectionStatus === 'disconnected') && 'SIMULATED DATA'}
                {connectionStatus === 'unavailable' && 'OFFLINE'}
                {connectionStatus === 'connecting' && 'CONNECTING...'}
              </span>
            </div>
          </div>

          {/* Real-Time Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400/60 text-sm">Active Vessels</p>
                  <p className="text-3xl font-bold text-cyan-400">{vesselCount}</p>
                </div>
                <FaShip className="text-4xl text-cyan-400/30" />
              </div>
            </div>

            {weather && (
              <>
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-400/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-400/60 text-sm">Temperature</p>
                      <p className="text-3xl font-bold text-orange-400">{weather.current.temp_c}°C</p>
                    </div>
                    <FaCloudSun className="text-4xl text-orange-400/30" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400/60 text-sm">Wind Speed</p>
                      <p className="text-3xl font-bold text-blue-400">{weather.current.wind_kph} kph</p>
                    </div>
                    <FaWater className="text-4xl text-blue-400/30" />
                  </div>
                </div>
              </>
            )}

            {tideData && tideData.heights && tideData.heights.length > 0 && (
              <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-400/60 text-sm">Current Tide</p>
                    <p className="text-3xl font-bold text-teal-400">
                      {tideData.heights[0].height?.toFixed(2) || 'N/A'}m
                    </p>
                  </div>
                  <FaAnchor className="text-4xl text-teal-400/30" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards selectedPort={globalSelectedPort} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-cyan-400/30 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
                  <FaGlobe className="mr-3" />
                  Live Port Map
                </h2>
                <div className="flex items-center space-x-2 text-sm text-cyan-400/60">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>Real-Time</span>
                </div>
              </div>
              <div className="h-[500px] rounded-xl overflow-hidden border border-cyan-400/20">
                <OpenSeaMap globalSelectedPort={globalSelectedPort} />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <AIInsights />
            
            {/* Weather Details */}
            {weather && (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-cyan-400/30 p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Weather Conditions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Condition:</span>
                    <span className="text-cyan-300">{weather.current.condition.text}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Feels Like:</span>
                    <span className="text-cyan-300">{weather.current.feelslike_c}°C</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Humidity:</span>
                    <span className="text-cyan-300">{weather.current.humidity}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Pressure:</span>
                    <span className="text-cyan-300">{weather.current.pressure_mb} mb</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400/60">Visibility:</span>
                    <span className="text-cyan-300">{weather.current.vis_km} km</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Port Statistics */}
        <MalaysianPortsStats globalSelectedPort={globalSelectedPort} />
      </div>
    </div>
  );
};

export default CyberHome;
