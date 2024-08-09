import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar';
import WeatherData from './components/WeatherData';
import MarineTrafficEmbed from './components/MarineTrafficEmbed'; // Import MarineTrafficEmbed
import VesselFinderEmbed from './components/VesselFinderEmbed'; // Import VesselFinderEmbed
import OpenSeaMap from './components/OpenSeaMap';
import TideData from './components/TideData'; // Import TideData
import MarineNews from './components/MarineNews'; // Import MarineNews
import Dashboard from './components/Dashboard';
import Header from './components/header';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar's visibility
  };

  return (
    <Router>
      <div className={`bg-light-gray min-h-screen duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          } `}>
          
        <Header />
        <div className="container mx-auto p-6"></div>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`transition-transform duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          } flex-1 pt-16 p-4`}
        >
          <Routes>
            <Route path="/weather" element={<WeatherData />} />
            <Route path="/tidedata" element={<TideData />} /> {/* Add this route */}
            <Route path="/openseamap" element={<OpenSeaMap />} />
            <Route path="/marinenews" element={<MarineNews />} /> {/* Add this route */}
            <Route path="/marine-traffic" element={<MarineTrafficEmbed />} /> {/* Route for MarineTrafficEmbed */}
            <Route path="/vessel-finder" element={<VesselFinderEmbed />} /> {/* Route for VesselFinderEmbed */}
            <Route path="/dashboard" element={<Dashboard weatherData={WeatherData} />} />

            <Route path="/" element={<h1 className=" Montserrat">Welcome to Cyberport : MARITIME INFORMATION AND MANAGEMENT
WEB APPLICATION: VIRTUAL CYBERPORT FOR
MARITIME MONITORING AND TRACKING </h1>} />
          </Routes>
        </div>
        </div>

      </div>
    </Router>
  );
}

export default App;
