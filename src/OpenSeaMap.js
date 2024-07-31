// src/components/OpenSeaMap.js
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const OpenSeaMap = ({ }) => {
    const lat = 5.2831; // Labuan latitude
    const lon = 115.2309; // Labuan longitude
    const zoom = 10; // Zoom level
  
    const marineTrafficUrl = `https://map.openseamap.org/?zoom=12&lon=115.18574&lat=5.29125&layers=TFTFFTTFFTTFTFFFFFFFTT`;
  
    return (
      <div class="container-fluid pt-4 px-4">
      <div class="bg-secondary text-center rounded p-4">
          <div class="d-flex align-items-center justify-content-between mb-4">
              <h6 class="mb-0">OpenSeaMap</h6>
          </div>
          <div class="table-responsive">
              <table class="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                  </thead>
                  <tbody>
                  <div style={{ position: 'relative', width: '170vh', height: '600px' }}>
                    <iframe
                      src={marineTrafficUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="MarineTraffic"
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'not-allowed',
                      backgroundColor: 'transparent',
                    }} />
                  </div>
                  </tbody>
              </table>
          </div>
      </div>
  </div>
    );
  };

export default OpenSeaMap;
