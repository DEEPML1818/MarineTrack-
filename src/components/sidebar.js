import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaCloudSun, FaShip, FaMapMarkedAlt, FaChartLine, FaWater, FaNewspaper, FaCompass } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../asset/Logo-v3.png'; // Import the image file

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isWeatherOpen, setIsWeatherOpen] = useState(false); // State for the Weather submenu

  const toggleWeather = () => {
    setIsWeatherOpen(!isWeatherOpen); // Toggle the Weather submenu
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 text-white text-2xl z-50"
      >
        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
      </button>
      <div
        className={`fixed top-0 left-0 h-screen transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        } bg-blue-950 text-white w-64 z-40 flex flex-col justify-between`}
      >
        <div className="p-6 flex-grow">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="mb-4"
              style={{ maxWidth: '50%', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </Link>
          <ul className="space-y-2">
            <li>
              <button
                onClick={toggleWeather}
                className="w-full text-left flex justify-between items-center py-2"
              >
                <div className="flex items-center">
                  <FaCloudSun className="mr-3" />
                  <Link to="/weather" className="block py-2 hover:bg-gray-700">
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
                <ul className="pl-4 space-y-1">
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
              <Link to="/marine-traffic" className="block py-2 hover:bg-gray-700 flex items-center">
                <FaShip className="mr-3" />
                Ship Tracker
              </Link>
            </li>
            <li>
              <Link to="/vessel-finder" className="block py-2 hover:bg-gray-700 flex items-center">
                <FaMapMarkedAlt className="mr-3" />
                Port Activity
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="block py-2 hover:bg-gray-700 flex items-center">
                <FaChartLine className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/openseamap" className="block py-2 hover:bg-gray-700 flex items-center">
                <FaCompass className="mr-3" />
                Nautical Chart
              </Link>
            </li>
            <li>
              <Link to="/tidedata" className="block py-2 hover:bg-gray-700 flex items-center">
                <FaWater className="mr-3" />
                Tide Data
              </Link>
            </li>
            <li>
              <Link to="/marinenews" className="block py-2 hover:bg-gray-700 flex items-center">
                <FaNewspaper className="mr-3" />
                Marine News
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <ul className="flex justify-between text-sm">
            <li>
              <Link to="/terms-and-conditions" className="hover:bg-gray-700 px-2">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:bg-gray-700 px-2">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:bg-gray-700 px-2">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:bg-gray-700 px-2">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
