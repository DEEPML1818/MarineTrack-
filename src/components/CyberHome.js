import React from 'react';
import { FaGlobe, FaChartBar, FaWater, FaCloudSun } from 'react-icons/fa';
import StatsCards from './StatsCards';
import AIInsights from './AIInsights';
import OpenSeaMap from './OpenSeaMap';
import MalaysianPortsStats from './MalaysianPortsStats';

const CyberHome = ({ globalSelectedPort }) => {
  return (
    <div className="min-h-screen p-6 pt-24 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-cyber">
          <h1 className="text-4xl font-bold mb-2 neon-text tracking-tight">
            Welcome to CyberPort
          </h1>
          <p className="text-cyan-300/70 text-lg">
            Maritime Information and Management Web Application
          </p>
          <p className="text-cyan-400/60 mt-2 leading-relaxed max-w-3xl">
            Virtual Cyberport for Maritime Monitoring and Tracking offers a comprehensive 
            solution for real-time data on weather conditions, ship tracking, tide 
            information, and more. Our platform is designed to support maritime 
            professionals by providing accurate and timely information in a user-friendly 
            interface.
          </p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 glassmorphism-card rounded-xl p-6 cyber-border hover-lift-cyber animate-fade-in-cyber" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center neon-glow mr-3">
                  <FaGlobe className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold neon-text tracking-wide">
                  Global Maritime Map
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all duration-300">
                  3D View
                </button>
                <button className="px-3 py-1 text-xs font-semibold rounded-lg text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
                  Filters
                </button>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden border border-cyan-500/30" style={{ height: '500px' }}>
              <OpenSeaMap />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="glassmorphism px-4 py-2 rounded-lg border border-cyan-500/30">
                  <span className="text-xs text-cyan-300">Tracking <span className="font-bold text-cyan-400">1,247</span> vessels</span>
                </div>
                <div className="glassmorphism px-4 py-2 rounded-lg border border-cyan-500/30">
                  <span className="text-xs text-cyan-300">Last update: <span className="font-bold text-cyan-400">2 sec ago</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <MalaysianPortsStats globalSelectedPort={globalSelectedPort} />

            <AIInsights />

            <div className="glassmorphism-card rounded-xl p-6 cyber-border hover-lift-cyber animate-fade-in-cyber" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center neon-glow mr-3">
                  <FaWater className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-cyan-400 tracking-wide">
                  Quick Access
                </h2>
              </div>

              <div className="space-y-3">
                <QuickAccessButton 
                  icon={FaChartBar} 
                  title="Tide Data" 
                  description="View tidal charts"
                  link="/tidedata"
                  color="#00f3ff"
                />
                <QuickAccessButton 
                  icon={FaCloudSun} 
                  title="Weather Data" 
                  description="Current conditions"
                  link="/weather"
                  color="#0099ff"
                />
                <QuickAccessButton 
                  icon={FaGlobe} 
                  title="Marine News" 
                  description="Latest updates"
                  link="/marinenews"
                  color="#2ec4b6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glassmorphism-card rounded-xl p-8 cyber-border text-center animate-fade-in-cyber" style={{ animationDelay: '0.4s' }}>
          <p className="text-cyan-300/80 text-sm mb-4">
            Navigate through our services using the sidebar to explore detailed 
            weather data, track vessels, access nautical charts, and stay 
            updated with the latest marine news.
          </p>
          <button className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover-lift-cyber neon-glow-strong transition-all duration-300">
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickAccessButton = ({ icon: Icon, title, description, link, color }) => {
  return (
    <a
      href={link}
      className="block p-4 glassmorphism rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover-lift-cyber group"
    >
      <div className="flex items-center">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
            border: `1px solid ${color}55`
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-cyan-300 mb-0.5 group-hover:text-cyan-200 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-cyan-400/60">
            {description}
          </p>
        </div>
        <svg 
          className="w-5 h-5 text-cyan-400/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
};

export default CyberHome;