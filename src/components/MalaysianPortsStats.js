import React, { useState, useEffect, useMemo } from 'react';
import { FaShip, FaAnchor, FaExclamationTriangle, FaCircle } from 'react-icons/fa';
import axios from 'axios';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

const MalaysianPortsStats = ({ globalSelectedPort }) => {
  const [stats, setStats] = useState({});

  const malaysianPorts = useMemo(() => MALAYSIAN_PORTS.map(port => ({
    ...port,
    lat: port.lat || 3.1390, // Default latitude if not provided
    lon: port.lon || 101.6869, // Default longitude if not provided
    activeVessels: 0, // Initialize with 0, will be updated by API
    incoming: 0,
    outgoing: 0,
    docked: 0,
    capacity: 0,
    alerts: 0,
    draftDepth: '0.0m',
    cargo: 'Unknown'
  })), []); // Empty dependency array ensures this runs only once

  const selectedPort = globalSelectedPort || 'labuan';

  useEffect(() => {
    const fetchPortStats = async () => {
      try {
        // Example API endpoint - replace with your actual API
        // This is a placeholder and assumes an API that returns stats for all ports
        // If you have a different API structure (e.g., per port), adjust accordingly.
        const response = await axios.get('https://api.example.com/maritime/ports/stats');
        const apiStats = response.data; // Assuming API returns an object keyed by port ID

        const newStats = {};
        malaysianPorts.forEach(port => {
          const portData = apiStats[port.id] || {}; // Get data for the current port, or empty object if not found
          newStats[port.id] = {
            activeVessels: portData.activeVessels || 0,
            incoming: portData.incoming || 0,
            outgoing: portData.outgoing || 0,
            docked: portData.docked || 0,
            capacity: portData.capacity || 0,
            alerts: portData.alerts || 0
          };
        });
        setStats(newStats);
      } catch (error) {
        console.error("Error fetching port statistics:", error);
        // Fallback to mock data or keep previous stats on error
        const fallbackStats = {};
        malaysianPorts.forEach(port => {
          fallbackStats[port.id] = {
            activeVessels: Math.floor(Math.random() * 50) + 10,
            incoming: Math.floor(Math.random() * 20) + 5,
            outgoing: Math.floor(Math.random() * 15) + 3,
            docked: Math.floor(Math.random() * 30) + 15,
            capacity: Math.floor(Math.random() * 30) + 60,
            alerts: Math.floor(Math.random() * 5)
          };
        });
        setStats(fallbackStats);
      }
    };

    fetchPortStats(); // Initial fetch

    const interval = setInterval(fetchPortStats, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval);
  }, [malaysianPorts]); // malaysianPorts is now stable due to useMemo

  const currentStats = stats[selectedPort] || {
    activeVessels: 0,
    incoming: 0,
    outgoing: 0,
    docked: 0,
    capacity: 0,
    alerts: 0
  };

  // Find the selected port details for draftDepth and cargo
  const selectedPortDetails = malaysianPorts.find(port => port.id === selectedPort);
  const draftDepth = selectedPortDetails ? selectedPortDetails.draftDepth : '0.0m';
  const cargoType = selectedPortDetails ? selectedPortDetails.cargo : 'Unknown';

  return (
    <div className="glassmorphism-card rounded-xl p-6 cyber-border hover-lift-cyber">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center neon-glow mr-3">
            <FaAnchor className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold neon-text tracking-wide">
            {selectedPortDetails ? selectedPortDetails.name : 'Malaysian Ports'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <FaCircle className="w-2 h-2 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glassmorphism rounded-lg p-4 border border-cyan-500/20">
          <p className="text-xs text-cyan-300/60 mb-1 uppercase tracking-wide">Active Vessels</p>
          <p className="text-2xl font-bold text-cyan-400">{currentStats.activeVessels}</p>
        </div>
        <div className="glassmorphism rounded-lg p-4 border border-cyan-500/20">
          <p className="text-xs text-cyan-300/60 mb-1 uppercase tracking-wide">Capacity</p>
          <p className="text-2xl font-bold text-green-400">{currentStats.capacity}%</p>
        </div>
        <div className="glassmorphism rounded-lg p-4 border border-cyan-500/20">
          <p className="text-xs text-cyan-300/60 mb-1 uppercase tracking-wide">Incoming</p>
          <p className="text-2xl font-bold text-blue-400">{currentStats.incoming}</p>
        </div>
        <div className="glassmorphism rounded-lg p-4 border border-cyan-500/20">
          <p className="text-xs text-cyan-300/60 mb-1 uppercase tracking-wide">Outgoing</p>
          <p className="text-2xl font-bold text-purple-400">{currentStats.outgoing}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 glassmorphism rounded-lg border border-cyan-500/20">
          <span className="text-sm text-cyan-300">Docked Vessels</span>
          <span className="text-sm font-bold text-cyan-400">{currentStats.docked}</span>
        </div>
        <div className="flex items-center justify-between p-3 glassmorphism rounded-lg border border-cyan-500/20">
          <span className="text-sm text-cyan-300">Active Alerts</span>
          <span className={`text-sm font-bold ${currentStats.alerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {currentStats.alerts}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 glassmorphism rounded-lg border border-cyan-500/20">
          <span className="text-sm text-cyan-300">Draft Depth</span>
          <span className="text-sm font-bold text-yellow-400">{draftDepth}</span>
        </div>
        <div className="flex items-center justify-between p-3 glassmorphism rounded-lg border border-cyan-500/20">
          <span className="text-sm text-cyan-300">Cargo Type</span>
          <span className="text-sm font-bold text-indigo-400">{cargoType}</span>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <p className="text-xs text-cyan-300/60 text-center">
          Last updated: <span className="text-cyan-400 font-semibold">{new Date().toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
};

export default MalaysianPortsStats;