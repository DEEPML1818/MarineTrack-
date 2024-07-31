// src/components/MarineTrafficEmbed.js
import React from 'react';
import './css/style.css';
import './css/bootstrap.min.css';

const MarineTrafficEmbed = () => {
  const marineTrafficUrl = `https://www.marinetraffic.com/ais/embed/centerx:115.242/centery:5.322/zoom:12`;
  const vesselFinderUrl = "https://www.vesselfinder.com/ports/MYLBU001"; // URL for Labuan port

  return (
    <div className="container-fluid pt-4" style={{ width: '170vh', height: '85vh' }}>
      <div className="row" style={{ height: '100%' }}>
        <div className="col-sm-12 col-xl-6 mb-4" style={{ height: '100%' }}>
          <div className="bg-secondary text-center rounded p-4" style={{ height: '100%' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0">Marine Traffic</h6>
            </div>
            <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 40px)' }}>
              <iframe
                src={marineTrafficUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="MarineTraffic"
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'not-allowed',
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xl-6 mb-4">
          <div className="bg-secondary text-center rounded p-4" style={{ height: '100%' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0">VesselFinder</h6>
            </div>
            <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 40px)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-900px', width: '100%', height: 'calc(100% + 1000px)' }}>
                <iframe
                  src={vesselFinderUrl}
                  style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                  }}
                  title="VesselFinder"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarineTrafficEmbed;
