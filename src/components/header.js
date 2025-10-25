import React, { useState } from 'react';
import { FaWater, FaCircle, FaAnchor, FaChevronDown } from 'react-icons/fa';
import { MALAYSIAN_PORTS } from '../constants/malaysianPorts';

const Header = ({ isSidebarOpen, selectedPort, onPortChange }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [isPortDropdownOpen, setIsPortDropdownOpen] = useState(false);

  const currentPort = MALAYSIAN_PORTS.find(p => p.id === selectedPort) || MALAYSIAN_PORTS[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-cyan-500/30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center neon-glow-strong border border-cyan-400/50">
                <FaWater className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="neon-text">CyberPort</span>
              </h1>
              <p className="text-xs text-cyan-300/80 tracking-wider uppercase font-medium">
                Maritime Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Port Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPortDropdownOpen(!isPortDropdownOpen)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 flex items-center space-x-2 min-w-[200px] justify-between"
            >
              <div className="flex items-center space-x-2">
                <FaAnchor className="w-3 h-3" />
                <span className="truncate">{currentPort.name}</span>
              </div>
              <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${isPortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPortDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-full min-w-[250px] glassmorphism rounded-lg border border-cyan-500/30 overflow-hidden max-h-96 overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
                {MALAYSIAN_PORTS.map((port) => (
                  <button
                    key={port.id}
                    onClick={() => {
                      onPortChange(port.id);
                      setIsPortDropdownOpen(false);
                    }}
                    className={`w-full p-3 text-left transition-all duration-300 border-b border-cyan-500/20 last:border-b-0 ${
                      selectedPort === port.id
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'text-cyan-400/80 hover:bg-cyan-500/20 hover:text-cyan-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{port.name}</span>
                      {selectedPort === port.id && (
                        <FaCircle className="w-2 h-2 text-cyan-400 animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('live')}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
              ${activeTab === 'live' 
                ? 'bg-cyan-500/20 text-cyan-400 neon-glow border border-cyan-500/50' 
                : 'text-cyan-300/60 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <FaCircle className="w-2 h-2 animate-pulse" />
              <span>LIVE</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
              ${activeTab === 'reports' 
                ? 'bg-cyan-500/20 text-cyan-400 neon-glow border border-cyan-500/50' 
                : 'text-cyan-300/60 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent'
              }
            `}
          >
            REPORTS
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
              ${activeTab === 'settings' 
                ? 'bg-cyan-500/20 text-cyan-400 neon-glow border border-cyan-500/50' 
                : 'text-cyan-300/60 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent'
              }
            `}
          >
            SETTINGS
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 glassmorphism rounded-lg border border-cyan-500/30">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-cyan-300/60">System Status:</span>
              <span className="text-green-400 font-semibold flex items-center">
                <FaCircle className="w-2 h-2 mr-1.5 animate-pulse" />
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
    </header>
  );
};

export default Header;
