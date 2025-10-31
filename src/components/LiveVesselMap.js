import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveVesselMap.css';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

// Custom vessel icon
const vesselIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDBhOGZmIj48cGF0aCBkPSJNMjEgMyBIMTUgTDEyIDEgTDkgMyBIMyBWMTMgTDEyIDIzIEwyMSAxMyBWMyBaIE0xMiA2IEwxNSA5IEwxMiAxMiBMOSA5IEwxMiA2IFoiLz48L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const portIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmY2NjAwIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Auto-zoom component
function AutoZoom({ vessels, selectedPort }) {
  const map = useMap();

  useEffect(() => {
    if (vessels.length > 0) {
      const bounds = vessels.map(v => [v.latitude, v.longitude]);
      const port = MALAYSIAN_PORTS.find(p => p.id === selectedPort);
      if (port) {
        bounds.push([port.lat, port.lon]);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vessels, selectedPort, map]);

  return null;
}

const LiveVesselMap = ({ globalSelectedPort }) => {
  const [vessels, setVessels] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [vesselTracks, setVesselTracks] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef(null);

  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];

  const getNavigationalStatusText = (status) => {
    const statuses = {
      0: 'Under way using engine',
      1: 'At anchor',
      2: 'Not under command',
      3: 'Restricted manoeuverability',
      4: 'Constrained by draught',
      5: 'Moored',
      6: 'Aground',
      7: 'Engaged in fishing',
      8: 'Under way sailing',
      14: 'AIS-SART',
      15: 'Undefined'
    };
    return statuses[status] || 'Unknown';
  };

  const getVesselTypeText = (type) => {
    if (type >= 70 && type <= 79) return 'Cargo';
    if (type >= 80 && type <= 89) return 'Tanker';
    if (type >= 60 && type <= 69) return 'Passenger';
    if (type >= 30 && type <= 39) return 'Fishing';
    return 'Other';
  };

  useEffect(() => {
    const connectToAIS = () => {
      const apiKey = process.env.REACT_APP_AISSTREAM_API_KEY || '786e06e04c50efda09a5075482678ca8b48014fd';

      if (!apiKey) {
        console.error('AIS API key not found');
        setConnectionStatus('error');
        return;
      }

      wsRef.current = new WebSocket('wss://stream.aisstream.io/v0/stream');

      wsRef.current.onopen = () => {
        console.log('Connected to AIS Stream');
        setConnectionStatus('connected');

        const subscribeMessage = {
          APIKey: apiKey,
          BoundingBoxes: [
            [[0.8, 99.5], [7.5, 119.5]]
          ],
          FilterMessageTypes: ['PositionReport', 'ShipStaticData']
        };

        wsRef.current.send(JSON.stringify(subscribeMessage));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.MessageType === 'PositionReport') {
            const mmsi = message.MetaData?.MMSI;
            const position = message.Message?.PositionReport;

            if (mmsi && position && position.Latitude && position.Longitude) {
              setVessels(prev => {
                const existingIndex = prev.findIndex(v => v.mmsi === mmsi);
                const vesselData = {
                  mmsi,
                  latitude: position.Latitude,
                  longitude: position.Longitude,
                  speed: position.Sog || 0,
                  course: position.Cog || 0,
                  heading: position.TrueHeading || 0,
                  status: position.NavigationalStatus,
                  lastUpdate: Date.now(),
                  name: prev[existingIndex]?.name || `Vessel ${mmsi}`,
                  type: prev[existingIndex]?.type,
                  callSign: prev[existingIndex]?.callSign,
                  destination: prev[existingIndex]?.destination
                };

                // Update vessel tracks
                setVesselTracks(prevTracks => {
                  const track = prevTracks[mmsi] || [];
                  const newTrack = [...track, [position.Latitude, position.Longitude]];
                  // Keep only last 50 positions
                  if (newTrack.length > 50) newTrack.shift();
                  return { ...prevTracks, [mmsi]: newTrack };
                });

                if (existingIndex >= 0) {
                  const updated = [...prev];
                  updated[existingIndex] = vesselData;
                  return updated;
                } else {
                  return [...prev, vesselData];
                }
              });
            }
          } else if (message.MessageType === 'ShipStaticData') {
            const mmsi = message.MetaData?.MMSI;
            const staticData = message.Message?.ShipStaticData;

            if (mmsi && staticData) {
              setVessels(prev => {
                const existingIndex = prev.findIndex(v => v.mmsi === mmsi);
                const vesselData = {
                  mmsi,
                  name: staticData.Name?.trim() || `Vessel ${mmsi}`,
                  callSign: staticData.CallSign,
                  type: staticData.Type,
                  destination: staticData.Destination?.trim(),
                  eta: staticData.Eta,
                  length: (staticData.Dimension?.A || 0) + (staticData.Dimension?.B || 0),
                  width: (staticData.Dimension?.C || 0) + (staticData.Dimension?.D || 0),
                  lastUpdate: Date.now()
                };

                if (existingIndex >= 0) {
                  return prev.map((v, i) => i === existingIndex ? { ...v, ...vesselData } : v);
                } else {
                  return [...prev, vesselData];
                }
              });
            }
          }
        } catch (error) {
          console.error('Error processing AIS message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from AIS Stream');
        setConnectionStatus('disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectToAIS, 5000);
      };
    };

    connectToAIS();

    // Cleanup old vessels every 30 seconds
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setVessels(prev => prev.filter(v => now - v.lastUpdate < 30 * 60 * 1000));
    }, 30000);

    return () => {
      clearInterval(cleanupInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const filteredVessels = vessels.filter(v => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'moving') return v.speed > 1;
    if (filterStatus === 'stationary') return v.speed <= 1;
    if (filterStatus === 'anchored') return v.status === 1;
    return true;
  });

  return (
    <div className="live-vessel-map-container">
      <div className="map-controls">
        <div className="connection-indicator">
          <span className={`status-dot ${connectionStatus}`}></span>
          <span className="status-text">
            {connectionStatus === 'connected' ? `Live: ${filteredVessels.length} vessels` : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>

        <div className="filter-buttons">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            All ({vessels.length})
          </button>
          <button 
            className={filterStatus === 'moving' ? 'active' : ''} 
            onClick={() => setFilterStatus('moving')}
          >
            Moving ({vessels.filter(v => v.speed > 1).length})
          </button>
          <button 
            className={filterStatus === 'stationary' ? 'active' : ''} 
            onClick={() => setFilterStatus('stationary')}
          >
            Stationary ({vessels.filter(v => v.speed <= 1).length})
          </button>
          <button 
            className={filterStatus === 'anchored' ? 'active' : ''} 
            onClick={() => setFilterStatus('anchored')}
          >
            Anchored ({vessels.filter(v => v.status === 1).length})
          </button>
        </div>
      </div>

      <MapContainer 
        center={[selectedPort.lat, selectedPort.lon]} 
        zoom={8} 
        style={{ height: 'calc(100vh - 200px)', width: '100%' }}
        scrollWheelZoom={true}
      >
        <AutoZoom vessels={filteredVessels} selectedPort={globalSelectedPort} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a>'
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        />

        {/* Port markers */}
        {MALAYSIAN_PORTS.map(port => (
          <Marker key={port.id} position={[port.lat, port.lon]} icon={portIcon}>
            <Popup>
              <div className="port-popup">
                <h3>{port.name}</h3>
                <p>Major Malaysian Port</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vessel markers and tracks */}
        {filteredVessels.map(vessel => (
          <React.Fragment key={vessel.mmsi}>
            {vesselTracks[vessel.mmsi] && vesselTracks[vessel.mmsi].length > 1 && (
              <Polyline 
                positions={vesselTracks[vessel.mmsi]} 
                color="#00a8ff" 
                weight={2} 
                opacity={0.6}
              />
            )}

            <Marker
              position={[vessel.latitude, vessel.longitude]}
              icon={vesselIcon}
              eventHandlers={{
                click: () => setSelectedVessel(vessel)
              }}
            >
              <Popup>
                <div className="vessel-popup">
                  <h3>{vessel.name}</h3>
                  <div className="vessel-details">
                    <p><strong>MMSI:</strong> {vessel.mmsi}</p>
                    {vessel.callSign && <p><strong>Call Sign:</strong> {vessel.callSign}</p>}
                    {vessel.type && <p><strong>Type:</strong> {getVesselTypeText(vessel.type)}</p>}
                    <p><strong>Speed:</strong> {vessel.speed?.toFixed(1)} knots</p>
                    <p><strong>Course:</strong> {vessel.course?.toFixed(0)}°</p>
                    <p><strong>Heading:</strong> {vessel.heading?.toFixed(0)}°</p>
                    <p><strong>Status:</strong> {getNavigationalStatusText(vessel.status)}</p>
                    {vessel.destination && <p><strong>Destination:</strong> {vessel.destination}</p>}
                    {vessel.length && <p><strong>Dimensions:</strong> {vessel.length}m × {vessel.width}m</p>}
                    <p className="last-update">
                      Updated: {new Date(vessel.lastUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {selectedVessel && (
        <div className="vessel-info-panel">
          <button className="close-btn" onClick={() => setSelectedVessel(null)}>×</button>
          <h2>{selectedVessel.name}</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">MMSI:</span>
              <span className="value">{selectedVessel.mmsi}</span>
            </div>
            <div className="info-item">
              <span className="label">Speed:</span>
              <span className="value">{selectedVessel.speed?.toFixed(1)} knots</span>
            </div>
            <div className="info-item">
              <span className="label">Course:</span>
              <span className="value">{selectedVessel.course?.toFixed(0)}°</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value">{getNavigationalStatusText(selectedVessel.status)}</span>
            </div>
            {selectedVessel.destination && (
              <div className="info-item full-width">
                <span className="label">Destination:</span>
                <span className="value">{selectedVessel.destination}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVesselMap;