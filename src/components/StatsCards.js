import React, { useState, useEffect } from 'react';
import { FaShip, FaAnchor, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const StatsCards = () => {
  const [stats, setStats] = useState({
    activeVessels: 0,
    portsOnline: 0,
    alerts: 0,
    avgETA: 0
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [dataSource, setDataSource] = useState('unknown');

  useEffect(() => {
    const fetchMaritimeStats = async () => {
      try {
        const response = await fetch('/api/maritime-stats');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const targetStats = await response.json();
        
        setConnectionStatus(targetStats.connectionStatus || 'unknown');
        setDataSource(targetStats.dataSource || 'unknown');

        let frame = 0;
        const totalFrames = 60;

        const animateNumbers = () => {
          frame++;
          const progress = frame / totalFrames;
          const easeOut = 1 - Math.pow(1 - progress, 3);

          setStats({
            activeVessels: Math.floor(targetStats.activeVessels * easeOut),
            portsOnline: Math.floor(targetStats.portsOnline * easeOut),
            alerts: Math.floor(targetStats.alerts * easeOut),
            avgETA: (targetStats.avgETA * easeOut).toFixed(1)
          });

          if (frame < totalFrames) {
            requestAnimationFrame(animateNumbers);
          }
        };

        requestAnimationFrame(animateNumbers);
      } catch (error) {
        console.error('Error fetching maritime stats:', error);
        setStats({
          activeVessels: 0,
          portsOnline: 0,
          alerts: 0,
          avgETA: 0
        });
      }
    };

    const timer = setTimeout(() => {
      fetchMaritimeStats();
    }, 300);

    const interval = setInterval(() => {
      fetchMaritimeStats();
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const cardData = [
    {
      title: 'Active Vessels',
      value: stats.activeVessels,
      icon: FaShip,
      color: '#00f3ff',
      suffix: ''
    },
    {
      title: 'Ports Online',
      value: stats.portsOnline,
      icon: FaAnchor,
      color: '#0099ff',
      suffix: ''
    },
    {
      title: 'Alerts',
      value: stats.alerts,
      icon: FaExclamationTriangle,
      color: '#ff6b6b',
      suffix: ''
    },
    {
      title: 'Average ETA',
      value: stats.avgETA,
      icon: FaClock,
      color: '#2ec4b6',
      suffix: 'h'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-cyber">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="glassmorphism-card rounded-xl p-6 hover-lift-cyber cyber-border relative overflow-hidden group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
            <card.icon className="w-full h-full" style={{ color: card.color }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center neon-glow"
                style={{ 
                  background: `linear-gradient(135deg, ${card.color}22 0%, ${card.color}11 100%)`,
                  border: `1px solid ${card.color}44`
                }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-cyan-200 mb-2 tracking-wide uppercase">
              {card.title}
            </h3>
            
            <div className="flex items-baseline">
              <span 
                className="text-4xl font-bold animate-counter tracking-tight"
                style={{ color: card.color }}
              >
                {card.value}
              </span>
              <span 
                className="text-xl ml-1 font-semibold"
                style={{ color: card.color }}
              >
                {card.suffix}
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 scanline" style={{ color: card.color }}></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
