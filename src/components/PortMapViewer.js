
import React from 'react';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

const PortMapViewer = ({ globalSelectedPort }) => {
  const selectedPort = MALAYSIAN_PORTS.find(p => p.id === globalSelectedPort) || MALAYSIAN_PORTS[0];
  
  // Marine Traffic embed URL for individual port
  const marineTrafficUrl = `https://www.marinetraffic.com/en/ais/embed/zoom:12/centery:${selectedPort.lat}/centerx:${selectedPort.lon}/maptype:0/shownames:true/mmsi:0/shipid:0/fleet:/fleet_id:/vtypes:/showmenu:/remember:false`;

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">{selectedPort.name} - Live Traffic</h2>
          <p className="text-cyan-400/60 text-sm">Real-time vessel positions from MarineTraffic</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-400 font-semibold">LIVE</span>
        </div>
      </div>
      
      <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-cyan-400/20">
        <iframe
          src={marineTrafficUrl}
          className="w-full h-full"
          frameBorder="0"
          title={`${selectedPort.name} Marine Traffic`}
          allow="geolocation"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-400/30">
          <p className="text-xs text-cyan-400/60 mb-1">Latitude</p>
          <p className="text-lg font-bold text-cyan-400">{selectedPort.lat.toFixed(4)}°</p>
        </div>
        <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-400/30">
          <p className="text-xs text-cyan-400/60 mb-1">Longitude</p>
          <p className="text-lg font-bold text-cyan-400">{selectedPort.lon.toFixed(4)}°</p>
        </div>
        <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-400/30">
          <p className="text-xs text-cyan-400/60 mb-1">Country</p>
          <p className="text-lg font-bold text-cyan-400">Malaysia</p>
        </div>
        <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-400/30">
          <p className="text-xs text-cyan-400/60 mb-1">Type</p>
          <p className="text-lg font-bold text-cyan-400">Seaport</p>
        </div>
      </div>
    </div>
  );
};

export default PortMapViewer;
