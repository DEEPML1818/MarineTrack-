import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar';
import WeatherData from './components/WeatherData';
import MarineTrafficEmbed from './components/MarineTrafficEmbed'; // Import MarineTrafficEmbed
import VesselFinderEmbed from './components/VesselFinderEmbed'; // Import VesselFinderEmbed
import OpenSeaMap from './components/OpenSeaMap';
import TideData from './components/TideData'; // Import TideData
import MarineNews from './components/MarineNews'; // Import MarineNews
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Header from './components/header';
import AISDataPage from './components/AISDataPage';
import 'leaflet/dist/leaflet.css';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Set initial state to false to keep sidebar closed

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar's visibility
  };

  return (
    <Router>
      <div
        className={`bg-light-gray min-h-screen duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Header />

        <div className="container mx-auto p-6">
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
                <Route path="/historical-data/2023" element={<AISDataPage year={2023} />} />
                <Route path="/historical-data/2024" element={<AISDataPage year={2024} />} />
                <Route
                  path="/marine-traffic"
                  element={<MarineTrafficEmbed />} /* Route for MarineTrafficEmbed */
                />
                <Route
                  path="/vessel-finder"
                  element={<VesselFinderEmbed />} /* Route for VesselFinderEmbed */
                />
                <Route
                  path="/dashboard"
                  element={<Dashboard weatherData={WeatherData} />}
                />

                <Route
                  path="/"
                  element={
                    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] p-8">
                      <h1 className="text-4xl Montserrat font-bold mb-4">
                        Welcome to Cyberport
                      </h1>
                      <p className="text-xl text-gray-700 mb-8">
                        Maritime Information and Management Web Application
                      </p>
                      <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                        Virtual Cyberport for Maritime Monitoring and Tracking
                        offers a comprehensive solution for real-time data on
                        weather conditions, ship tracking, tide information, and
                        more. Our platform is designed to support maritime
                        professionals by providing accurate and timely
                        information in a user-friendly interface.
                      </p>
                      <img
                        className="my-8 rounded-lg shadow-lg"
                      />
                      <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                        Navigate through our services using the sidebar to
                        explore detailed weather data, track vessels, access
                        nautical charts, and stay updated with the latest marine
                        news.
                      </p>
                      <button
                        className="mt-8 px-6 py-3 bg-blue-950 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                        onClick={toggleSidebar}
                      >
                        Launch App
                      </button>
                    </div>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
        <Footer className="bg-blue-950 text-white py-8 mt-auto" />
      </div>
    </Router>
  );
}

export default App;
