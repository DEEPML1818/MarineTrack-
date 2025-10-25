import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaCloudSun, FaShip, FaMapMarkedAlt, FaChartLine, FaWater, FaNewspaper, FaCompass, FaDatabase, FaCode, FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import logo from '../asset/Logo-v4.png'; // Import the image file

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isWeatherOpen, setIsWeatherOpen] = useState(false); // State for the Weather submenu
  const [isHistoricalOpen, setIsHistoricalOpen] = useState(false); // State for the Historical Data submenu

  const toggleWeather = () => {
    setIsWeatherOpen(!isWeatherOpen); // Toggle the Weather submenu
  };

  const toggleHistorical = () => {
    setIsHistoricalOpen(!isHistoricalOpen); // Toggle the Historical Data submenu
  };

  return (
    <div className="flex h-screen">
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 text-white text-2xl p-3 rounded-lg glassmorphism hover:bg-cyan-500/30 transition-all duration-300 shadow-lg"
        style={{ zIndex: 150 }}
      >
        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } glassmorphism-card border-r border-cyan-500/30 text-white w-64 flex flex-col justify-between backdrop-blur-xl shadow-2xl`}
        style={{ background: 'rgba(0, 27, 46, 0.98)', zIndex: 140 }}
      >
        <div className="p-6 flex-grow">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="mb-4"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </Link>
          <ul className="space-y-2 font-bold">
            <li>
              <button
                onClick={toggleWeather}
                className="w-full text-left flex justify-between items-center py-2"
              >
                <div className="flex items-center">
                  <FaCloudSun className="mr-3" />
                  <Link to="/weather" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300">
                    Weather
                  </Link>
                </div>
                <span
                  className={`transform transition-transform ${
                    isWeatherOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </button>
              {isWeatherOpen && (
                <ul className="pl-4 space-y-1 font-bold">
                  {/* Weather sub-menu items */}
                  <li>
                    <ScrollLink to="temperature" smooth={true} duration={500}>
                      Temperature
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="feels-like" smooth={true} duration={500}>
                      Feels Like
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="wind" smooth={true} duration={500}>
                      Wind
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="humidity" smooth={true} duration={500}>
                      Humidity
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="cloud-cover" smooth={true} duration={500}>
                      Cloud Cover
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="precipitation" smooth={true} duration={500}>
                      Precipitation
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="pressure" smooth={true} duration={500}>
                      Pressure
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="uv-index" smooth={true} duration={500}>
                      UV Index
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="gust" smooth={true} duration={500}>
                      Gust
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="sea-wave-height" smooth={true} duration={500}>
                      Sea Wave Height
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="condition" smooth={true} duration={500}>
                      Condition
                    </ScrollLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/marine-traffic" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaShip className="mr-3 text-cyan-400" />
                Ship Tracker
              </Link>
            </li>
            <li>
              <Link to="/vessel-finder" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaMapMarkedAlt className="mr-3 text-cyan-400" />
                Port Activity
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaChartLine className="mr-3 text-cyan-400" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/openseamap" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaCompass className="mr-3 text-cyan-400" />
                Nautical Chart
              </Link>
            </li>
            <li>
              <Link to="/tidedata" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaWater className="mr-3 text-cyan-400" />
                Tide Data
              </Link>
            </li>
            <li>
              <Link to="/marinenews" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaNewspaper className="mr-3 text-cyan-400" />
                Marine News
              </Link>
            </li>
          </ul>
        </div>

        {/* New section for API and Historical Data */}
                {/* New section for API and Historical Data */}
                <div className="p-4">
          <ul className="space-y-2 font-bold text-sm"> {/* Added text-sm for smaller text */}
            <li>
              <button
                onClick={toggleHistorical}
                className="w-full text-left flex justify-between items-center py-1" // Reduced padding
              >
                <div className="flex items-center">
                  <FaDatabase className="mr-3 w-4 h-4" /> {/* Smaller icon size */}
                  <span className="block hover:bg-gray-700">
                    Historical Data
                  </span>
                </div>
                <span
                  className={`transform transition-transform ${
                    isHistoricalOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  {isHistoricalOpen ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />} {/* Smaller chevron */}
                </span>
              </button>
              {isHistoricalOpen && (
                <ul className="pl-4 space-y-1 font-bold text-sm"> {/* Reduced text size */}
                  {/* Historical Data sub-menu items */}
                  <li>
                    <Link to="/historical-data/2023" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300">
                      AIS-2023
                    </Link>
                  </li>
                  <li>
                    <Link to="/historical-data/2024" className="block py-2 hover:bg-cyan-500/20 rounded transition-all duration-300">
                      AIS-2024
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/api" className="block py-1 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaCode className="mr-3 w-4 h-4 text-cyan-400" />
                API
              </Link>
            </li>
            <li>
              <Link to="/marinetech" className="block py-1 hover:bg-cyan-500/20 rounded transition-all duration-300 flex items-center">
                <FaNewspaper className="mr-3 w-4 h-4 text-cyan-400" />
                MarineTech Press  
              </Link>
            </li>
          </ul>
        </div>


        {/* Terms and Conditions links */}
        <div className="p-4 border-t border-cyan-500/20">
          <ul className="flex flex-wrap justify-between text-sm">
            <li>
              <Link to="/terms-and-conditions" className="hover:bg-cyan-500/20 px-2 py-1 rounded transition-all duration-300 text-cyan-300/80 hover:text-cyan-300">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:bg-cyan-500/20 px-2 py-1 rounded transition-all duration-300 text-cyan-300/80 hover:text-cyan-300">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/pdpa" className="hover:bg-cyan-500/20 px-2 py-1 rounded transition-all duration-300 text-cyan-300/80 hover:text-cyan-300">
                PDPA
              </Link>
            </li>
            <li>
              <Link to="/gdpr" className="hover:bg-cyan-500/20 px-2 py-1 rounded transition-all duration-300 text-cyan-300/80 hover:text-cyan-300">
                GDPR
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
