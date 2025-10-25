import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import tideData from '../Server/tideData.json';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';
import "../components/TideData.css";

const TideData = ({ globalSelectedPort }) => {
  const [tides, setTides] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];

  useEffect(() => {
    // Directly set the tide data from the imported JSON file
    setTides(tideData.heights);
    if (tideData.timestamp) {
      setLastUpdated(new Date(tideData.timestamp));
    }
  }, []);

  const formattedTides = tides.map(tide => ({
    date: new Date(tide.date).toLocaleString(), // Format to full date and time
    height: tide.height
  }));

  const getDataAge = () => {
    if (!lastUpdated) return 'Unknown';
    const ageMs = Date.now() - lastUpdated.getTime();
    const hours = Math.floor(ageMs / 1000 / 60 / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Tide Data - {selectedPort.name}</h2>
        {lastUpdated && (
          <div style={{ fontSize: '0.875rem', color: '#00f3ff' }}>
            <div style={{ marginBottom: '0.25rem' }}>
              Source: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                {tideData.source || 'Unknown'}
              </span>
            </div>
            Last updated: {getDataAge()}
            <br />
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {lastUpdated.toLocaleString()}
            </span>
          </div>
        )}
      </div>
      {tides.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={formattedTides}>
            <defs>
              <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(tick) => {
              const date = new Date(tick);
              return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            }} />
            <YAxis />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
            <Area type="monotone" dataKey="height" stroke="#00f" fillOpacity={1} fill="url(#colorHeight)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p>No tide data available.</p>
      )}
    </div>
  );
};

export default TideData;
