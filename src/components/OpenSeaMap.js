
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OpenSeaMap.css';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map center updates
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const OpenSeaMap = ({ globalSelectedPort }) => {
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];

  return (
    <div style={{ height: '100%', width: '100%', padding: '10px' }}>
      <MapContainer 
        center={[selectedPort.lat, selectedPort.lon]} 
        zoom={10} 
        style={{ height: 'calc(100% - 80px)', width: '100%', borderRadius: '8px' }} 
        scrollWheelZoom={true}
      >
        <ChangeMapView center={[selectedPort.lat, selectedPort.lon]} zoom={10} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        />
        <Marker position={[selectedPort.lat, selectedPort.lon]}>
          <Popup>
            {selectedPort.name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default OpenSeaMap;
