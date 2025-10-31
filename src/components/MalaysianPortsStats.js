import React, { useState, useEffect, useMemo } from 'react';
import { FaAnchor, FaCircle } from 'react-icons/fa';
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
    // Fetch real port data from VesselFinder and AIS
    const updateStats = async () => {
      try {
        // Fetch VesselFinder scraped data
        const vesselFinderResponse = await fetch(`https://cyberport-maritime-information-and.onrender.com/api/vesselfinder/stats/${selectedPort}`);
        const vesselFinderData = await vesselFinderResponse.json();

        // Fetch AIS data as backup
        const aisResponse = await fetch('https://cyberport-maritime-information-and.onrender.com/api/port-stats');
        const aisData = await aisResponse.json();

        // Prioritize VesselFinder data if available
        if (vesselFinderData && vesselFinderData.isRealData) {
          setStats({ [selectedPort]: vesselFinderData });
        } else if (aisData && aisData[selectedPort] && aisData[selectedPort].isRealData !== false) {
          setStats(aisData);
        } else {
          console.log('No real data available for', selectedPort);
          setStats({});
        }
      } catch (error) {
        console.error('Error fetching port stats:', error);
        setStats({});
      }
    };

    updateStats(); // Initial fetch
    const interval = setInterval(updateStats, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [selectedPort]); // Update when selected port changes

  const currentStats = stats[selectedPort] || {
    activeVessels: 0,
    incoming: 0,
    outgoing: 0,
    docked: 0,
    capacity: 0,
    alerts: 0,
    isRealData: false,
    inPort: 0 // Ensure inPort is available, default to 0
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
          {currentStats.isRealData && currentStats.activeVessels > 0 ? (
            <>
              <FaCircle className="w-2 h-2 text-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">VESSELFINDER DATA</span>
            </>
          ) : (
            <>
              <FaCircle className="w-2 h-2 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold">LOADING...</span>
            </>
          )}
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
        <div className="flex items-center justify-between p-3 glassmorphism rounded-lg border border-cyan-500/20">
          <span className="text-sm text-cyan-300">In Port</span>
          <span className="text-sm font-bold text-blue-400">{currentStats.inPort}</span>
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