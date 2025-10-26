
import React, { useState, useEffect } from 'react';
import { FaGlobe, FaChartBar, FaWater, FaCloudSun, FaShip, FaAnchor } from 'react-icons/fa';
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
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];

  useEffect(() => {
    // Fetch real-time weather data
    const fetchWeather = async () => {
      try {
        const weatherApiKey = '4d5ea12f38be4e04b8c120842242507';
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${selectedPort.lat},${selectedPort.lon}`
        );
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    // Fetch real-time tide data
    const fetchTideData = async () => {
      try {
        const response = await axios.get('http://0.0.0.0:3001/api/tide-data');
        setTideData(response.data);
      } catch (error) {
        console.error('Error fetching tide data:', error);
      }
    };

    // Fetch real-time vessel data from AIS Hub (free API)
    const fetchVesselData = async () => {
      try {
        // Using AISHub free API - requires registration at aishub.net
        // Alternative: Use vessel density API or Marine Traffic public endpoints
        const radius = 50; // km radius from port
        const response = await axios.get(
          `https://data.aishub.net/ws.php?username=AH_DEMO&format=1&output=json&compress=0&latmin=${selectedPort.lat - 0.5}&latmax=${selectedPort.lat + 0.5}&lonmin=${selectedPort.lon - 0.5}&lonmax=${selectedPort.lon + 0.5}`
        );
        
        if (response.data && response.data[0]) {
          const vessels = response.data[0].ERROR === 'FALSE' ? response.data[1] : [];
          setVesselCount(vessels.length || 0);
          setVesselData(vessels);
        }
      } catch (error) {
        console.error('Error fetching vessel data:', error);
        // Fallback: Try alternative free API - MyShipTracking
        try {
          const bbox = `${selectedPort.lon - 0.5},${selectedPort.lat - 0.5},${selectedPort.lon + 0.5},${selectedPort.lat + 0.5}`;
          const altResponse = await axios.get(
            `https://api.myshiptracking.com/vessels.json?bbox=${bbox}`
          );
          setVesselCount(altResponse.data?.length || 0);
          setVesselData(altResponse.data);
        } catch (altError) {
          console.error('Error with alternative vessel API:', altError);
          setVesselCount(0);
        }
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
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-3 rounded-xl border border-green-400/30">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-400 font-semibold">LIVE DATA FEED</span>
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
        <StatsCards />

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

      <style jsx>{`
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
};

export default CyberHome;
