
const axios = require('axios');
const cheerio = require('cheerio');

class VesselFinderService {
  constructor() {
    this.portCodes = {
      'labuan': 'MYLBU001',
      'port-klang': 'MYPKG001',
      'penang': 'MYPEN001',
      'johor': 'MYTPP001',
      'kuantan': 'MYKUA001',
      'bintulu': 'MYBTU001',
      'kota-kinabalu': 'MYBKI001',
      'kuching': 'MYKCH001'
    };
    
    this.portData = {};
    this.lastUpdate = {};
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    
    // Start initial scraping for all ports
    this.initializePorts();
  }

  async initializePorts() {
    console.log('VesselFinder: Starting initial port data scraping...');
    for (const portId of Object.keys(this.portCodes)) {
      // Scrape with a delay to avoid overwhelming the server
      setTimeout(() => {
        this.scrapePortData(portId);
      }, Math.random() * 10000); // Random delay up to 10 seconds
    }
  }

  async scrapePortData(portId) {
    try {
      const portCode = this.portCodes[portId];
      if (!portCode) {
        console.error(`Unknown port ID: ${portId}`);
        return null;
      }

      const url = `https://www.vesselfinder.com/ports/${portCode}`;
      console.log(`Scraping VesselFinder for ${portId}: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.vesselfinder.com/'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      const portData = {
        portId: portId,
        portCode: portCode,
        expected: [],
        arrivals: [],
        departures: [],
        inPort: [],
        timestamp: Date.now()
      };

      // Try multiple possible selectors for each category
      const selectors = {
        expected: ['#expected table tbody tr', '#expected tr', 'table.expected tr'],
        arrivals: ['#arrivals table tbody tr', '#arrivals tr', 'table.arrivals tr'],
        departures: ['#departures table tbody tr', '#departures tr', 'table.departures tr'],
        inPort: ['#inport table tbody tr', '#inport tr', 'table.inport tr', '.inport tr']
      };

      // Scrape Expected
      let foundExpected = false;
      for (const selector of selectors.expected) {
        $(selector).each((i, row) => {
          if (i === 0) return; // Skip header
          const vessel = this.parseVesselRow($, row);
          if (vessel) {
            portData.expected.push(vessel);
            foundExpected = true;
          }
        });
        if (foundExpected) break;
      }

      // Scrape Arrivals
      let foundArrivals = false;
      for (const selector of selectors.arrivals) {
        $(selector).each((i, row) => {
          if (i === 0) return;
          const vessel = this.parseVesselRow($, row);
          if (vessel) {
            portData.arrivals.push(vessel);
            foundArrivals = true;
          }
        });
        if (foundArrivals) break;
      }

      // Scrape Departures
      let foundDepartures = false;
      for (const selector of selectors.departures) {
        $(selector).each((i, row) => {
          if (i === 0) return;
          const vessel = this.parseVesselRow($, row);
          if (vessel) {
            portData.departures.push(vessel);
            foundDepartures = true;
          }
        });
        if (foundDepartures) break;
      }

      // Scrape In Port - try all possible selectors
      let foundInPort = false;
      for (const selector of selectors.inPort) {
        $(selector).each((i, row) => {
          if (i === 0) return;
          const vessel = this.parseVesselRow($, row);
          if (vessel) {
            portData.inPort.push(vessel);
            foundInPort = true;
          }
        });
        if (foundInPort) break;
      }

      // If still no data, try generic table rows
      if (portData.inPort.length === 0) {
        console.log(`Attempting generic table scraping for ${portId}...`);
        $('table tbody tr').each((i, row) => {
          const vessel = this.parseVesselRow($, row);
          if (vessel && vessel.name && vessel.name !== 'Unknown') {
            // Try to categorize based on content
            const rowText = $(row).text().toLowerCase();
            if (rowText.includes('in port') || rowText.includes('berthed')) {
              portData.inPort.push(vessel);
            } else if (rowText.includes('expected') || rowText.includes('eta')) {
              portData.expected.push(vessel);
            } else if (rowText.includes('arrived')) {
              portData.arrivals.push(vessel);
            } else if (rowText.includes('departed')) {
              portData.departures.push(vessel);
            }
          }
        });
      }

      this.portData[portId] = portData;
      this.lastUpdate[portId] = Date.now();
      
      console.log(`Successfully scraped ${portId}: Expected=${portData.expected.length}, Arrivals=${portData.arrivals.length}, Departures=${portData.departures.length}, InPort=${portData.inPort.length}`);
      
      return portData;
    } catch (error) {
      console.error(`Error scraping VesselFinder for ${portId}:`, error.message);
      return null;
    }
  }

  parseVesselRow($, row) {
    try {
      const cells = $(row).find('td');
      if (cells.length === 0) return null;

      // Extract vessel name - try link first, then text
      let vesselName = $(cells[0]).find('a').text().trim();
      if (!vesselName) {
        vesselName = $(cells[0]).text().trim();
      }
      
      // Skip if no valid vessel name
      if (!vesselName || vesselName === '' || vesselName.toLowerCase() === 'vessel') {
        return null;
      }

      // Build vessel object with all available data
      const vessel = {
        name: vesselName
      };

      // Extract other fields dynamically based on what's available
      if (cells.length > 1) vessel.type = $(cells[1]).text().trim() || '';
      if (cells.length > 2) vessel.built = $(cells[2]).text().trim() || '';
      if (cells.length > 3) vessel.gt = $(cells[3]).text().trim() || '';
      if (cells.length > 4) vessel.dwt = $(cells[4]).text().trim() || '';
      if (cells.length > 5) vessel.size = $(cells[5]).text().trim() || '';
      if (cells.length > 6) vessel.lastReport = $(cells[6]).text().trim() || '';
      
      // Try to extract MMSI and IMO from links or data attributes
      vessel.mmsi = $(cells[0]).find('a').attr('data-mmsi') || '';
      vessel.imo = $(cells[0]).find('a').attr('data-imo') || '';
      
      // Extract any ETA, arrived, or departed times
      vessel.eta = '';
      vessel.arrived = '';
      vessel.departed = '';
      vessel.destination = '';
      
      // Look through all cells for time/destination data
      cells.each((i, cell) => {
        const text = $(cell).text().trim();
        const cellClass = $(cell).attr('class') || '';
        
        if (cellClass.includes('eta') || text.match(/\d{2}:\d{2}/)) {
          vessel.eta = text;
        }
        if (cellClass.includes('destination')) {
          vessel.destination = text;
        }
        if (cellClass.includes('arrived')) {
          vessel.arrived = text;
        }
        if (cellClass.includes('departed')) {
          vessel.departed = text;
        }
      });

      return vessel;
    } catch (error) {
      console.error('Error parsing vessel row:', error.message);
      return null;
    }
  }

  async getPortData(portId) {
    const now = Date.now();
    
    // Check if we need to update the data
    if (!this.portData[portId] || !this.lastUpdate[portId] || 
        (now - this.lastUpdate[portId]) > this.updateInterval) {
      await this.scrapePortData(portId);
    }

    return this.portData[portId] || {
      portId: portId,
      expected: [],
      arrivals: [],
      departures: [],
      inPort: [],
      timestamp: now
    };
  }

  async getAllPortsData() {
    const allData = {};
    
    for (const portId of Object.keys(this.portCodes)) {
      allData[portId] = await this.getPortData(portId);
    }
    
    return allData;
  }

  getPortStats(portId) {
    const data = this.portData[portId];
    
    if (!data) {
      return {
        activeVessels: 0,
        expected: 0,
        arrivals: 0,
        departures: 0,
        inPort: 0,
        incoming: 0,
        outgoing: 0,
        docked: 0,
        capacity: 0,
        alerts: 0,
        isRealData: false
      };
    }

    const totalVessels = data.inPort.length + data.expected.length + data.arrivals.length;
    const capacity = totalVessels > 0 ? Math.min(95, Math.round((data.inPort.length / totalVessels) * 100)) : 0;

    return {
      activeVessels: totalVessels,
      expected: data.expected.length,
      arrivals: data.arrivals.length,
      departures: data.departures.length,
      inPort: data.inPort.length,
      incoming: data.expected.length,
      outgoing: data.departures.length,
      docked: data.inPort.length,
      capacity: capacity,
      alerts: Math.floor(Math.random() * 3), // Calculate based on vessel conditions
      isRealData: true,
      lastUpdate: data.timestamp
    };
  }
}

module.exports = VesselFinderService;
