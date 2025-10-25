import React, { useState, useEffect } from 'react';
import { FaBrain, FaExclamationCircle, FaChartLine, FaRoute, FaClock, FaShip } from 'react-icons/fa';

const AIInsights = () => {
  const [visibleInsights, setVisibleInsights] = useState([]);

  const insights = [
    {
      id: 1,
      type: 'warning',
      icon: FaExclamationCircle,
      color: '#ff9900',
      title: 'Unusual route detected',
      description: 'Vessel MV-7845 deviating from standard shipping lane',
      time: '2 min ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'prediction',
      icon: FaChartLine,
      color: '#00f3ff',
      title: 'Predicted congestion spike',
      description: 'Port Alpha expected to reach 95% capacity in 6 hours',
      time: '5 min ago',
      severity: 'high'
    },
    {
      id: 3,
      type: 'optimization',
      icon: FaRoute,
      color: '#2ec4b6',
      title: 'Route optimization available',
      description: 'Alternative path could save 2.3 hours for vessel CX-9921',
      time: '12 min ago',
      severity: 'low'
    },
    {
      id: 4,
      type: 'alert',
      icon: FaClock,
      color: '#ff6b6b',
      title: 'Delayed arrival detected',
      description: 'Container ship arriving 45 minutes late at Terminal 5',
      time: '18 min ago',
      severity: 'medium'
    },
    {
      id: 5,
      type: 'info',
      icon: FaShip,
      color: '#0099ff',
      title: 'Fleet efficiency increased',
      description: 'Average fuel consumption down 8% this week',
      time: '1 hour ago',
      severity: 'low'
    }
  ];

  useEffect(() => {
    insights.forEach((_, index) => {
      setTimeout(() => {
        setVisibleInsights(prev => [...prev, index]);
      }, index * 150);
    });
  }, [insights]);

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'high': return 'border-red-500/40';
      case 'medium': return 'border-yellow-500/40';
      default: return 'border-cyan-500/40';
    }
  };

  return (
    <div className="glassmorphism-card rounded-xl p-6 cyber-border">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center neon-glow mr-3">
          <FaBrain className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold neon-text tracking-wide">
          AI Insights
        </h2>
        <div className="ml-auto">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-glow-pulse">
            LIVE
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`
              glassmorphism rounded-lg p-4 border-l-4 ${getSeverityClass(insight.severity)}
              hover-lift-cyber transition-all duration-300 cursor-pointer
              ${visibleInsights.includes(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
            `}
            style={{
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: `${index * 0.05}s`
            }}
          >
            <div className="flex items-start">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${insight.color}33 0%, ${insight.color}11 100%)`,
                  border: `1px solid ${insight.color}55`
                }}
              >
                <insight.icon className="w-4 h-4" style={{ color: insight.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 
                    className="text-sm font-semibold truncate"
                    style={{ color: insight.color }}
                  >
                    {insight.title}
                  </h3>
                  <span className="text-xs text-cyan-300/60 ml-2 flex-shrink-0">
                    {insight.time}
                  </span>
                </div>
                
                <p className="text-xs text-cyan-100/70 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent holographic opacity-0 group-hover:opacity-100"></div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <button className="w-full py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center justify-center group">
          <span>View All Insights</span>
          <svg 
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
