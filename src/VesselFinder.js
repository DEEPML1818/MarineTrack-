// src/components/VesselFinderEmbed.js
import React from 'react';

const VesselFinderEmbed = () => {
  const vesselFinderUrl = "https://www.vesselfinder.com/ports/MYLBU001"; // URL for Labuan port

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', overflow: 'hidden' }}>
      <iframe
        src={vesselFinderUrl}
        style={{
          width: '50%',
          height: '1500px', // Set this to a height that includes the desired portion
          border: 'none',
          position: 'absolute',
          overflow: 'scroll',
          'overflow-x': 'hidden',
          top: '-900px', // Adjust this to position the desired portion in view
        }}
        title="VesselFinder"
      />
    </div>
  );
};

export default VesselFinderEmbed;
