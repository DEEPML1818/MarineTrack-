// Dashboard.js
import React from 'react';
import MarineTrafficEmbed from './MarineTrafficEmbed';
import WeatherData from './WeatherData';
import TideData from './TideData';
import Map from './Map';

const Dashboard = () => {
  const lat = 37.7749; // Example latitude
  const lon = -122.4194; // Example longitude

  return (
    <div>
      <h1>Marine Dashboard</h1>
      <MarineTrafficEmbed />
      <Map lat={lat} lon={lon} />
      <WeatherData lat={lat} lon={lon} />
      <TideData lat={lat} lon={lon} />
    </div>
  );
};

export default Dashboard;
