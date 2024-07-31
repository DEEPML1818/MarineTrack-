// src/components/TideData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TideData = () => {
  const [tides, setTides] = useState([]);
  const lat = 5.2831;
  const lon = 115.2309;
  const apiKey = '740b448c-c1d1-4bd1-9b72-bed650cf8033';
  const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  useEffect(() => {
    const fetchTideData = async () => {
      try {
        const response = await axios.get(`https://www.worldtides.info/api/v2?heights&lat=${lat}&lon=${lon}&key=${apiKey}`);
        const data = response.data;

        // Store data and current timestamp in local storage
        localStorage.setItem('tideData', JSON.stringify(data.heights));
        localStorage.setItem('tideDataTimestamp', Date.now());

        setTides(data.heights);
      } catch (error) {
        console.error('Error fetching tide data:', error);
      }
    };

    const storedTideData = localStorage.getItem('tideData');
    const storedTimestamp = localStorage.getItem('tideDataTimestamp');

    if (storedTideData && storedTimestamp) {
      const dataAge = Date.now() - storedTimestamp;

      if (dataAge < oneDayInMs * 2) { // Check if data is less than 2 days old
        setTides(JSON.parse(storedTideData));
        return;
      }
    }

    fetchTideData();
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
