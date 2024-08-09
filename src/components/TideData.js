import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import tideData from './tide-data-backend/tideData.json';
import "../components/TideData.css";

const TideData = () => {
  const [tides, setTides] = useState([]);

  useEffect(() => {
    // Directly set the tide data from the imported JSON file
    setTides(tideData.heights);
  }, []);

  const formattedTides = tides.map(tide => ({
    date: new Date(tide.date).toLocaleString(), // Format to full date and time
    height: tide.height
  }));

  return (
    <div>
      <h2>Tide Data</h2>
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
