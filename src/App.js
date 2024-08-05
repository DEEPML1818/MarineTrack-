// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Link as ScrollLink, Element } from 'react-scroll'; // Import from react-scroll
import MarineTrafficEmbed from './MarineTrafficEmbed';
import MapComponent from './MapComponent';
import WeatherData from './WeatherData';
import OpenSeaMap from './OpenSeaMap';
import TideData from './TideData';
import 'leaflet/dist/leaflet.css';
import VesselFinder from './VesselFinder';
import MarineNews from './MarineNews';
import AirPollutionData from './AirPollutionData';
import './lib/owlcarousel/assets/owl.carousel.min.css';
import './lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css';
import './css/style.css'; // Custom styles
import './css/bootstrap.min.css';
import './css/weather.css';
import logo from './Website-Header-Logo-Photoroom.png'; // Import the image
import logo1 from './website-logo-Photoroom.png';

function App() {
  const lat = 5.2831; // Labuan latitude
  const lon = 115.2309; // Labuan longitude

  return (
    <Router>
      <div className="App container-fluid position-relative d-flex p-0" style={{ backgroundColor: '#002B5B' }}>
        <div className="sidebar pe-4 pb-3" style={{ backgroundColor: '#001f3f' }}>
          <nav className="navbar navbar-dark" style={{ backgroundColor: '#002B5B' ,  }}>
            <Link to="/" className="navbar-brand mx-4 mb-3">
              <img src={logo1} alt="CyberPort Logo" style={{ height: '200px', position: 'relative', bottom: '10px' , left: '-59px' }} />
            </Link>
            <div className="navbar-nav w-100">
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-tachometer-alt me-2"></i>Weather
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Temperature
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Feels Like
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Wind
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Humidity
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Cloud Cover
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Precipitation
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Pressure
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>UV Index
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Gust
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Sea Wave Height
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>Condition
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>AQI
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>PM2.5
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>PM10
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>CO
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>NO
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>NO2
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>O3
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>SO2
              </ScrollLink>
              <ScrollLink to="weather-data" smooth={true} duration={500} className="nav-item nav-link active" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-thermometer-half me-2"></i>NH3
              </ScrollLink>
              <ScrollLink to="marine-traffic" smooth={true} duration={500} className="nav-item nav-link" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-ship me-2"></i>Ship Tracker 
              </ScrollLink>
              <ScrollLink to="marine-traffic" smooth={true} duration={500} className="nav-item nav-link" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-ship me-2"></i>Port Activity 
              </ScrollLink>
              <ScrollLink to="openseamap" smooth={true} duration={500} className="nav-item nav-link" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-map-marked-alt me-2"></i>Nautical Chart
              </ScrollLink>
              <ScrollLink to="tide-data" smooth={true} duration={500} className="nav-item nav-link" style={{ color: '#fff', padding: '10px' }} activeClass="active">
                <i className="fa fa-water me-2"></i>Tide Data
              </ScrollLink>
              <Link to="/marine-news" className="nav-item nav-link" style={{ color: '#fff', padding: '10px' }}>
                <i className="fa fa-newspaper me-2"></i>MarineNews
              </Link>
              {/* Add more navigation links as needed */}
            </div>
          </nav>
        </div>
        <div className="content" style={{ backgroundColor: '#002B5B'  }}>
          <nav className="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0" style={{ height: '10vh', backgroundColor: '#001f3f' }}>
            <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
              <h2 className="text-primary mb-0"><i className="fa fa-user-edit"></i></h2>
            </a>
            <a href="#" className="sidebar-toggler flex-shrink-0">
              <i className="fa fa-bars"></i>
            </a>
            <form className="d-none d-md-flex ms-4" style={{ backgroundColor: '#002B5B'  }}>
              <input className="form-control bg-dark border-0 text-white" type="search" placeholder="Search" />
            </form>
            <img src={logo} alt="Website Header Logo" style={{ position: 'absolute', height: '70%', right: '10px' }} />
          </nav>
          <Routes>
            <Route path="/" element={
              <main>
                <Element name="weather-data">
                  <WeatherData />
                </Element>
                <Element name="marine-traffic">
                  <MarineTrafficEmbed />
                </Element>
                <Element name="openseamap">
                  <OpenSeaMap />
                </Element>
                <Element name="tide-data">
                  <TideData lat={lat} lon={lon} />
                </Element>
              </main>
            } />
            <Route path="/marine-news" element={<MarineNews />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
