
// src/components/MarineNews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/MarineNews.css';

const MarineNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using a free RSS to JSON converter for maritime news
    const fetchNews = async () => {
      try {
        // Maritime Executive RSS feed converted to JSON
        const response = await axios.get(
          'https://api.rss2json.com/v1/api.json?rss_url=https://maritime-executive.com/rss.xml'
        );
        
        if (response.data && response.data.items) {
          setNews(response.data.items.slice(0, 20)); // Get latest 20 articles
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching marine news:', error);
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glassmorphism-card rounded-xl p-8 text-center">
        <div className="text-cyan-400 text-xl">Loading latest maritime news...</div>
      </div>
    );
  }

  return (
    <div className="glassmorphism-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold neon-text">Live Maritime News</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {news.map((article, index) => (
          <div 
            key={index} 
            className="glassmorphism rounded-lg p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover-lift-cyber"
          >
            <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-2 hover:text-cyan-300">
                {article.title}
              </h3>
              <p className="text-sm text-cyan-300/80 mb-3 line-clamp-3">
                {article.description?.replace(/<[^>]*>/g, '')}
              </p>
              <div className="flex items-center justify-between text-xs text-cyan-400/60">
                <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                <span className="text-cyan-400">Read more →</span>
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-cyan-300/60">
        <p>News updates every 5 minutes from Maritime Executive</p>
      </div>
    </div>
  );
};

export default MarineNews;
