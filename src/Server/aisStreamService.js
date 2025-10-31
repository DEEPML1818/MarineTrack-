const WebSocket = require('ws');
const axios = require('axios');

class AISStreamService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = null;
    this.vessels = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 5000;
    this.isConnecting = false;
    this.lastUpdate = null;
    this.marinesiaData = null;
    this.marinesiaLastFetch = null;
    
    this.malaysianPorts = {
      'labuan': { lat: 5.2831, lon: 115.2309, name: 'Labuan Port' },
      'port-klang': { lat: 2.9988, lon: 101.3939, name: 'Port Klang' },
      'penang': { lat: 5.4164, lon: 100.3327, name: 'Penang Port' },
      'johor': { lat: 1.3639, lon: 103.6088, name: 'Johor Port' },
      'kuantan': { lat: 3.9667, lon: 103.4333, name: 'Kuantan Port' },
      'bintulu': { lat: 3.1667, lon: 113.0333, name: 'Bintulu Port' },
      'kota-kinabalu': { lat: 5.9804, lon: 116.0735, name: 'Kota Kinabalu Port' },
      'kuching': { lat: 1.5535, lon: 110.3493, name: 'Kuching Port' }
    };
  }

  async fetchMarineTrafficData() {
    try {
      const apiKey = process.env.MARINETRAFFIC_API_KEY;
      
      if (!apiKey) {
        console.log('MarineTraffic API key not found. Using AIS stream data only.');
        return false;
      }

      console.log('Fetching vessel data from MarineTraffic API...');
      
      // Fetch vessels in Malaysian waters using MarineTraffic's free PS07 endpoint
      const response = await axios.get('https://services.marinetraffic.com/api/exportvessels/v:8/' + apiKey, {
        params: {
          protocol: 'jsono',
          msgtype: 'simple',
          minlat: 0.8,
          maxlat: 7.5,
          minlon: 99.5,
          maxlon: 119.5,
          timespan: 20 // Last 20 minutes
        },
        timeout: 15000
      });

      if (response.data && Array.isArray(response.data)) {
        this.marinesiaLastFetch = Date.now();
        
        // Process MarineTraffic data
        response.data.forEach(vessel => {
          if (vessel.MMSI && vessel.LAT && vessel.LON) {
            const existingVessel = this.vessels.get(vessel.MMSI) || {
              mmsi: vessel.MMSI,
              firstSeen: Date.now()
            };

            this.vessels.set(vessel.MMSI, {
              ...existingVessel,
              latitude: parseFloat(vessel.LAT),
              longitude: parseFloat(vessel.LON),
              speed: parseFloat(vessel.SPEED) || existingVessel.speed,
              course: parseFloat(vessel.COURSE) || existingVessel.course,
              heading: parseFloat(vessel.HEADING) || existingVessel.heading,
              name: vessel.SHIPNAME || existingVessel.name || 'Unknown',
              type: vessel.SHIPTYPE || existingVessel.type,
              status: vessel.STATUS || existingVessel.status,
              destination: vessel.DESTINATION || existingVessel.destination,
              lastUpdate: Date.now(),
              nearestPort: this.findNearestPort(parseFloat(vessel.LAT), parseFloat(vessel.LON)),
              source: 'marinetraffic',
              callSign: vessel.CALLSIGN,
              flag: vessel.FLAG
            });
          }
        });

        this.lastUpdate = Date.now();
        console.log(`MarineTraffic: Loaded ${response.data.length} vessels`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('MarineTraffic API error:', error.response?.data || error.message);
      return false;
    }
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('AIS Stream: Already connected or connecting');
      return;
    }

    // Fetch MarineTraffic data immediately
    this.fetchMarineTrafficData();

    // Set up periodic MarineTraffic fetching (every 2 minutes)
    this.marinesiaInterval = setInterval(() => {
      this.fetchMarineTrafficData();
    }, 120000);

    this.isConnecting = true;
    console.log('AIS Stream: Connecting to aisstream.io...');

    try {
      this.ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

      this.ws.on('open', () => {
        console.log('AIS Stream: Connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        const subscribeMessage = {
          APIKey: this.apiKey,
          BoundingBoxes: [
            [
              [0.8, 99.5],
              [7.5, 119.5]
            ]
          ],
          FilterMessageTypes: ['PositionReport', 'ShipStaticData']
        };

        this.ws.send(JSON.stringify(subscribeMessage));
        console.log('AIS Stream: Subscribed to Malaysian waters');
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.processAISMessage(message);
        } catch (error) {
          console.error('AIS Stream: Error processing message:', error.message);
        }
      });

      this.ws.on('error', (error) => {
        console.error('AIS Stream: WebSocket error:', error.message);
        this.isConnecting = false;
        if (this.ws) {
          this.ws.close();
        }
      });

      this.ws.on('close', () => {
        console.log('AIS Stream: Connection closed');
        this.isConnecting = false;
        this.ws = null;
        this.scheduleReconnect();
      });

    } catch (error) {
      console.error('AIS Stream: Connection error:', error.message);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
        60000
      );
      console.log(`AIS Stream: Reconnecting in ${delay / 1000} seconds (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('AIS Stream: Max reconnection attempts reached');
    }
  }

  processAISMessage(message) {
    try {
      if (message.MessageType === 'PositionReport') {
        const mmsi = message.MetaData?.MMSI;
        const position = message.Message?.PositionReport;
        
        if (mmsi && position) {
          const vessel = this.vessels.get(mmsi) || {
            mmsi: mmsi,
            firstSeen: Date.now()
          };

          vessel.latitude = position.Latitude;
          vessel.longitude = position.Longitude;
          vessel.speed = position.Sog;
          vessel.course = position.Cog;
          vessel.heading = position.TrueHeading;
          vessel.status = position.NavigationalStatus;
          vessel.lastUpdate = Date.now();
          vessel.nearestPort = this.findNearestPort(position.Latitude, position.Longitude);

          this.vessels.set(mmsi, vessel);
        }
      } else if (message.MessageType === 'ShipStaticData') {
        const mmsi = message.MetaData?.MMSI;
        const staticData = message.Message?.ShipStaticData;
        
        if (mmsi && staticData) {
          const vessel = this.vessels.get(mmsi) || {
            mmsi: mmsi,
            firstSeen: Date.now()
          };

          vessel.name = staticData.Name?.trim() || 'Unknown';
          vessel.callSign = staticData.CallSign;
          vessel.type = staticData.Type;
          vessel.destination = staticData.Destination?.trim();
          vessel.eta = staticData.Eta;
          vessel.length = staticData.Dimension?.A + staticData.Dimension?.B;
          vessel.width = staticData.Dimension?.C + staticData.Dimension?.D;

          this.vessels.set(mmsi, vessel);
        }
      }

      this.lastUpdate = Date.now();
      this.cleanupOldVessels();

    } catch (error) {
      console.error('AIS Stream: Error processing AIS message:', error.message);
    }
  }

  findNearestPort(lat, lon) {
    let nearestPort = null;
    let minDistance = Infinity;

    for (const [portId, port] of Object.entries(this.malaysianPorts)) {
      const distance = this.calculateDistance(lat, lon, port.lat, port.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPort = portId;
      }
    }

    return nearestPort;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  cleanupOldVessels() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000;
    
    for (const [mmsi, vessel] of this.vessels.entries()) {
      if (now - vessel.lastUpdate > maxAge) {
        this.vessels.delete(mmsi);
      }
    }
  }

  getAggregatedStats() {
    const now = Date.now();
    const hasAIS = this.ws?.readyState === WebSocket.OPEN;
    const hasMarineSIA = this.marinesiaLastFetch && (now - this.marinesiaLastFetch) < 300000; // 5 min
    
    const stats = {
      activeVessels: this.vessels.size,
      portsOnline: 0,
      alerts: 0,
      avgETA: 0,
      lastUpdate: this.lastUpdate,
      connectionStatus: hasAIS ? 'connected' : (hasMarineSIA ? 'marinesia' : 'disconnected'),
      dataAge: this.lastUpdate ? Math.floor((now - this.lastUpdate) / 1000) : null,
      dataSources: []
    };

    if (hasAIS) stats.dataSources.push('aisstream.io');
    if (hasMarineSIA) stats.dataSources.push('marinetraffic.com');

    const portVesselCounts = {};
    let totalIncoming = 0;
    let vesselsWithETA = 0;

    for (const [portId] of Object.entries(this.malaysianPorts)) {
      portVesselCounts[portId] = 0;
    }

    for (const vessel of this.vessels.values()) {
      if (vessel.nearestPort) {
        portVesselCounts[vessel.nearestPort]++;
      }

      if (vessel.status === 0) {
        totalIncoming++;
        if (vessel.eta) {
          vesselsWithETA++;
        }
      }

      if (vessel.status && (vessel.status === 14 || vessel.status === 6)) {
        stats.alerts++;
      }
    }

    stats.portsOnline = Object.values(portVesselCounts).filter(count => count > 0).length;
    
    // Calculate real average ETA from actual vessel data (no random numbers)
    if (totalIncoming > 0 && vesselsWithETA > 0) {
      let totalETA = 0;
      let validETACount = 0;
      
      for (const vessel of this.vessels.values()) {
        if (vessel.status === 0 && vessel.eta) {
          const etaTime = new Date(vessel.eta).getTime();
          const currentTime = Date.now();
          const hoursToETA = (etaTime - currentTime) / (1000 * 60 * 60);
          
          if (hoursToETA > 0 && hoursToETA < 72) {
            totalETA += hoursToETA;
            validETACount++;
          }
        }
      }
      
      stats.avgETA = validETACount > 0 ? (totalETA / validETACount).toFixed(1) : 0;
    } else {
      stats.avgETA = 0;
    }

    return stats;
  }

  getPortStats() {
    const portStats = {};
    
    // Initialize port stats with real data flag
    for (const [portId, port] of Object.entries(this.malaysianPorts)) {
      portStats[portId] = {
        name: port.name,
        activeVessels: 0,
        incoming: 0,
        outgoing: 0,
        docked: 0,
        alerts: 0,
        capacity: 0,
        isRealData: true
      };
    }

    // Only count real vessels from AIS stream
    for (const vessel of this.vessels.values()) {
      if (vessel.nearestPort && portStats[vessel.nearestPort]) {
        const port = portStats[vessel.nearestPort];
        port.activeVessels++;

        if (vessel.status === 0) {
          port.incoming++;
        } else if (vessel.status === 5 || vessel.status === 1) {
          port.docked++;
        } else if (vessel.speed && vessel.speed > 1) {
          port.outgoing++;
        }

        if (vessel.status && (vessel.status === 14 || vessel.status === 6)) {
          port.alerts++;
        }
      }
    }

    // Calculate realistic capacity based on actual vessel count
    for (const portId in portStats) {
      const stats = portStats[portId];
      if (stats.activeVessels > 0) {
        // Estimate capacity based on vessel activity
        const totalActivity = stats.incoming + stats.outgoing + stats.docked;
        stats.capacity = totalActivity > 0 ? Math.min(95, Math.round((totalActivity / stats.activeVessels) * 100)) : 0;
      }
    }

    return portStats;
  }

  getLiveVessels() {
    const vesselArray = Array.from(this.vessels.values());
    return vesselArray.filter(vessel => {
      const hasPosition = vessel.latitude !== undefined && vessel.longitude !== undefined;
      const isRecent = vessel.lastUpdate && (Date.now() - vessel.lastUpdate) < 30 * 60 * 1000;
      return hasPosition && isRecent;
    });
  }

  disconnect() {
    if (this.ws) {
      console.log('AIS Stream: Disconnecting...');
      this.ws.close();
      this.ws = null;
    }
    if (this.marinesiaInterval) {
      clearInterval(this.marinesiaInterval);
      this.marinesiaInterval = null;
    }
  }
}

module.exports = AISStreamService;
