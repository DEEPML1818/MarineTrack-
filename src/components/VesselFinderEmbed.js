import React from 'react';

const VesselFinderEmbed = () => {
  const vesselFinderUrl = "https://www.vesselfinder.com/ports/MYLBU001"; // URL for Labuan port

  return (
    <div style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      width: '100%', // Adjust width as needed
      height: '50vh', // Adjust height as needed
     
      overflow: 'hidden' // Hide the overflow to ensure only the desired part is shown
    }}>
      <iframe
        src={vesselFinderUrl}
        style={{
          position: 'relative',
          width: '100%',
          height: '300%', // Make iframe content taller
          border: 'none',
          top: '-90vh' // Move the iframe up to hide the top part
        }}
        title="marinelink"
      />
    </div>
  );
};

export default VesselFinderEmbed;
