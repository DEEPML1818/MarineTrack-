// Map.js
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const Map = ({ lat, lon }) => {
  return (
    <MapContainer center={[lat, lon]} zoom={10} style={{ height: '600px', width: '50%' }}>
      <TileLayer
        url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        attribution="&copy; OpenSeaMap contributors"
      />
      {/* Add more layers or markers here */}
    </MapContainer>
  );
};

export default Map;
