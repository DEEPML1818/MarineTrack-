// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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

function App() {
  const lat = 5.2831; // Labuan latitude
  const lon = 115.2309; // Labuan longitude

  return (
    <Router>
      <div className="App container-fluid position-relative d-flex p-0">
        <div className="sidebar pe-4 pb-3">
          <nav className="navbar bg-secondary navbar-dark">
            <Link to="/" className="navbar-brand mx-4 mb-3">
              <h3 className="text-primary"><i className="fa fa-user-edit me-2"></i>CyberPort: Maritime Information and Management Portal</h3>
            </Link>
            <div className="d-flex align-items-center ms-4 mb-4">
              <div className="ms-3"></div>
            </div>
            <div className="navbar-nav w-100">
              <Link to="/" className="nav-item nav-link active"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</Link>
              <Link to="/marine-news" className="nav-item nav-link"><i className="fa fa-newspaper me-2"></i>Marine News</Link>
              {/* Add more navigation links as needed */}
            </div>
          </nav>
        </div>
        <div className="content">
          <nav style={{ height: '10vh'}} class="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0" >
          <a href="index.html" class="navbar-brand d-flex d-lg-none me-4">
                    <h2 class="text-primary mb-0"><i class="fa fa-user-edit"></i></h2>
                </a>
                <a href="#" class="sidebar-toggler flex-shrink-0">
                    <i class="fa fa-bars"></i>
                </a>
                <form class="d-none d-md-flex ms-4">
                    <input class="form-control bg-dark border-0" type="search" placeholder="Search"></input>
                </form>
          </nav>
          <Routes>
            <Route path="/" element={
              <main>
                <WeatherData />
                <MarineTrafficEmbed />
                <OpenSeaMap />
                <TideData lat={lat} lon={lon} />                
                
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
