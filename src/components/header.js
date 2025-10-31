import React, { useState, useRef, useEffect } from "react";
import {
  FaWater,
  FaCircle,
  FaAnchor,
  FaChevronDown,
  FaShip,
} from "react-icons/fa";
import { createPortal } from "react-dom";
import { MALAYSIAN_PORTS } from "../constants/malaysianPorts";

const Header = ({ isSidebarOpen, selectedPort, onPortChange }) => {
  const [activeTab, setActiveTab] = useState("live");
  const [isPortDropdownOpen, setIsPortDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const currentPort =
    MALAYSIAN_PORTS.find((p) => p.id === selectedPort) || MALAYSIAN_PORTS[0];

  useEffect(() => {
    if (isPortDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isPortDropdownOpen]);

  // Dropdown render as portal
  const renderDropdown = () => {
    if (!isPortDropdownOpen) return null;
    return createPortal(
      <>
        {/* Overlay Behind Dropdown */}
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsPortDropdownOpen(false)}
        />

        {/* Dropdown Panel */}
        <div
          className="fixed rounded-xl border border-cyan-400/30 shadow-2xl max-h-[500px] overflow-y-auto z-[9999] backdrop-blur-2xl"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.98)",
            top: dropdownPosition?.top ?? 60,
            left: dropdownPosition?.left ?? 100,
            minWidth: "350px",
            width: "350px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2">
            {MALAYSIAN_PORTS.map((port) => (
              <button
                key={port.id}
                onClick={() => {
                  onPortChange(port.id);
                  setIsPortDropdownOpen(false);
                }}
                className={`w-full p-3 text-left transition-all duration-300 rounded-lg mb-1 last:mb-0 ${
                  selectedPort === port.id
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/30"
                    : "text-cyan-400/80 hover:bg-cyan-500/10 hover:text-cyan-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{port.name}</span>
                  {selectedPort === port.id && (
                    <FaCircle className="w-2 h-2 text-green-400 animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </>,
      document.body,
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 border-b border-cyan-400/20 shadow-2xl">
      {/* Animated Background Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-400/30 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                  <FaShip className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-green-300"></span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  CyberPort
                </h1>
                <p className="text-xs text-cyan-400/70 tracking-widest uppercase font-medium">
                  Maritime Intelligence
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>

            {/* Port Selector */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsPortDropdownOpen(!isPortDropdownOpen)}
                className="group px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 hover:from-cyan-500/20 hover:to-blue-500/20 flex items-center space-x-3 min-w-[220px] justify-between shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-center space-x-2">
                  <FaAnchor className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span className="truncate">{currentPort.name}</span>
                </div>
                <FaChevronDown
                  className={`w-3 h-3 transition-all duration-300 ${
                    isPortDropdownOpen
                      ? "rotate-180 text-cyan-300"
                      : "text-cyan-400/60"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Tabs */}
            <nav className="flex items-center space-x-2 bg-slate-800/50 rounded-xl p-1.5 border border-cyan-400/20 backdrop-blur-sm">
              {["live", "reports", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 shadow-lg shadow-cyan-500/20 border border-cyan-400/30"
                      : "text-cyan-400/60 hover:text-cyan-300 hover:bg-white/5"
                  }`}
                >
                  {tab === "live" ? (
                    <div className="flex items-center space-x-2">
                      <FaCircle
                        className={`w-2 h-2 ${
                          activeTab === "live"
                            ? "animate-ping text-green-400"
                            : ""
                        }`}
                      />
                      <span>Live</span>
                    </div>
                  ) : (
                    <span className="capitalize">{tab}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Divider */}
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>

            {/* System Status */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-5 py-2.5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl border border-green-400/30 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-green-400/60 uppercase tracking-wider font-medium">
                      System
                    </span>
                    <span className="text-sm text-green-400 font-bold">
                      Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

      {/* Render dropdown outside header */}
      {renderDropdown()}
    </header>
  );
};

export default Header;