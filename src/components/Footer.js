import React from 'react';
import { FaPlay, FaFileDownload, FaFacebook, FaLinkedin, FaDiscord, FaTelegramPlane, FaReddit, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-cyan-500/30 glassmorphism">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          
          <div className="flex items-center space-x-4">
            <button className="group relative px-6 py-3 rounded-lg font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover-lift-cyber">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 neon-glow-strong opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2 text-white">
                <FaPlay className="w-4 h-4" />
                <span>Launch Simulation</span>
              </span>
            </button>

            <button className="group relative px-6 py-3 rounded-lg font-semibold text-sm tracking-wide overflow-hidden border border-cyan-500/50 transition-all duration-300 hover-lift-cyber">
              <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2 text-cyan-400 group-hover:text-cyan-300">
                <FaFileDownload className="w-4 h-4" />
                <span>Export Report</span>
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.facebook.com/people/CyberPort/61564157661366/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glassmorphism border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 hover-lift-cyber neon-glow-hover group"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/cyber-port-58bb33321/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glassmorphism border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 hover-lift-cyber group"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://discord.gg/danNnHhTyt" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glassmorphism border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 hover-lift-cyber group"
              >
                <FaDiscord className="w-4 h-4" />
              </a>
              <a 
                href="https://t.me/+v0N25cMGLtsxZTRl" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glassmorphism border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 hover-lift-cyber group"
              >
                <FaTelegramPlane className="w-4 h-4" />
              </a>
              <a 
                href="https://reddit.com/r/CyberPortDigital/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glassmorphism border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 hover-lift-cyber group"
              >
                <FaReddit className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/Maritime-Systems" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glassmorphism border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 hover-lift-cyber group"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-xs text-cyan-300/60 tracking-wide">
              &copy; {new Date().getFullYear()} CyberPort Maritime Intelligence. All rights reserved.
            </p>
          </div>

          <div className="glassmorphism px-4 py-2 rounded-lg border border-cyan-500/30">
            <p className="text-xs text-cyan-300/70">
              Contact: <a href="mailto:cyberport.digital@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">cyberport.digital@gmail.com</a>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
