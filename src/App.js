import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WeatherData from './components/WeatherData';
import MarineTrafficEmbed from './components/MarineTrafficEmbed';
import VesselFinderEmbed from './components/VesselFinderEmbed';
import OpenSeaMap from './components/OpenSeaMap';
import TideData from './components/TideData';
import MarineNews from './components/MarineNews';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Header from './components/header';
import AISDataPage from './components/AISDataPage';
import CyberHome from './components/CyberHome';
import LiveVesselMap from './components/LiveVesselMap';
import 'leaflet/dist/leaflet.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSelectedPort, setGlobalSelectedPort] = useState('labuan');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePortChange = (portId) => {
    setGlobalSelectedPort(portId);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          selectedPort={globalSelectedPort} 
          onPortChange={handlePortChange}
        />

        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<CyberHome globalSelectedPort={globalSelectedPort} />} />
            <Route path="/weather" element={<div className="p-6 pt-24"><WeatherData globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/tidedata" element={<div className="p-6 pt-24"><TideData globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/openseamap" element={<div className="p-6 pt-24"><OpenSeaMap globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/marinenews" element={<div className="p-6 pt-24"><MarineNews globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/historical-data/2023" element={<div className="p-6 pt-24"><AISDataPage year={2023} /></div>} />
            <Route path="/historical-data/2024" element={<div className="p-6 pt-24"><AISDataPage year={2024} /></div>} />
            <Route path="/marine-traffic" element={<div className="p-6 pt-24"><MarineTrafficEmbed globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/vessel-finder" element={<div className="p-6 pt-24"><VesselFinderEmbed globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/live-vessel-map" element={<div className="p-6 pt-24"><LiveVesselMap globalSelectedPort={globalSelectedPort} /></div>} />
            <Route path="/dashboard" element={<div className="p-6 pt-24"><Dashboard weatherData={WeatherData} globalSelectedPort={globalSelectedPort} /></div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;