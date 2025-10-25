import React from 'react';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';
import './VesselFinderEmbed.css';

const VesselFinderEmbed = ({ globalSelectedPort }) => {
  const portCodes = {
    'labuan': 'MYLBU001',
    'port-klang': 'MYPKG001',
    'penang': 'MYPEN001',
    'johor': 'MYTPP001',
    'kuantan': 'MYKUA001',
    'bintulu': 'MYBTU001',
    'kota-kinabalu': 'MYBKI001',
    'kuching': 'MYKCH001'
  };

  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];
  const vesselFinderUrl = `https://www.vesselfinder.com/ports/${portCodes[selectedPort.id]}`;

  return (
    <div>
      <div style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%',
        height: '50vh',
      }}>
        <iframe
          key={selectedPort.id}
          src={vesselFinderUrl}
          style={{
            position: 'relative',
            width: '100%',
            height: '300%',
            border: 'none',
            top: '-90vh'
          }}
          title="marinelink"
        />
      </div>
    </div>
  );
};

export default VesselFinderEmbed;