import React from 'react';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

const MarineTrafficEmbed = ({ globalSelectedPort }) => {
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];
  const marineTrafficUrl = `https://www.marinetraffic.com/ais/embed/centerx:${selectedPort.lon}/centery:${selectedPort.lat}/zoom:14`;

  return (
    <div className="container-fluid pt-4" style={{ width: '100%', height: '85vh' }}>
      <div className="row" style={{ height: '100%' }}>
        <div className="col-sm-12" style={{ height: '100%' }}>
          <div className="bg-secondary text-center rounded p-4" style={{ height: '100%' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0">Marine Traffic - {selectedPort.name}</h6>
            </div>
            <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 40px)' }}>
              <iframe
                src={marineTrafficUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="MarineTraffic"
              />
              <div
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarineTrafficEmbed;
