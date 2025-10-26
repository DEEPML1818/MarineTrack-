
// Shared service for port statistics to ensure consistency across components
class PortDataService {
  constructor() {
    this.currentStats = {};
    this.lastUpdate = null;
    this.updateInterval = 15000; // 15 seconds
  }

  // Realistic vessel counts based on actual Malaysian port traffic
  portVesselCounts = {
    'labuan': { min: 20, max: 35 },
    'port-klang': { min: 150, max: 220 }, // Malaysia's busiest port
    'penang': { min: 80, max: 120 },
    'johor': { min: 120, max: 180 }, // Tanjung Pelepas - major container port
    'kuantan': { min: 35, max: 60 },
    'bintulu': { min: 50, max: 80 },
    'kota-kinabalu': { min: 25, max: 50 },
    'kuching': { min: 30, max: 55 }
  };

  generatePortStats() {
    const stats = {};
    const now = Date.now();

    Object.keys(this.portVesselCounts).forEach(portId => {
      const portData = this.portVesselCounts[portId];
      const activeVessels = Math.floor(Math.random() * (portData.max - portData.min + 1)) + portData.min;
      const docked = Math.floor(activeVessels * 0.6) + Math.floor(Math.random() * 5);
      const incoming = Math.floor(activeVessels * 0.2) + Math.floor(Math.random() * 3);
      const outgoing = Math.floor(activeVessels * 0.15) + Math.floor(Math.random() * 3);
      
      stats[portId] = {
        activeVessels: activeVessels,
        incoming: incoming,
        outgoing: outgoing,
        docked: docked,
        capacity: 70 + Math.floor(Math.random() * 25), // 70-95% capacity
        alerts: Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 1 : 0
      };
    });

    this.currentStats = stats;
    this.lastUpdate = now;
    return stats;
  }

  getPortStats(portId) {
    const now = Date.now();
    
    // Generate new stats if none exist or if update interval has passed
    if (!this.lastUpdate || (now - this.lastUpdate) >= this.updateInterval) {
      this.generatePortStats();
    }

    return this.currentStats[portId] || {
      activeVessels: 0,
      incoming: 0,
      outgoing: 0,
      docked: 0,
      capacity: 0,
      alerts: 0
    };
  }

  getAllPortStats() {
    const now = Date.now();
    
    // Generate new stats if none exist or if update interval has passed
    if (!this.lastUpdate || (now - this.lastUpdate) >= this.updateInterval) {
      this.generatePortStats();
    }

    return this.currentStats;
  }

  forceUpdate() {
    return this.generatePortStats();
  }
}

// Export a singleton instance
export default new PortDataService();
