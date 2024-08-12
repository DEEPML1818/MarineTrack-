import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaDiscord, FaTelegramPlane, FaReddit, FaGithub } from 'react-icons/fa';
import Logo from "../asset/Header.png";
import MarineTech from "../asset/Marinetech.png";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-4">

          {/* Logo */}
          <div>
            <img src={Logo} alt="Logo" className="h-12" />
          </div>

          {/* Contact Information and Important Links */}
          <div className="flex flex-col md:flex-row justify-between w-full mt-4 md:space-x-8">
            <div className="text-left">
              <h5 className="text-lg font-bold mb-2">Contact Us</h5>
              <p className="text-sm">Bandar Putera 2, Klang, Selangor 41200</p>
              <p className="text-sm">Email: cyberport.digital@gmail.com</p>
              <p className="text-sm">Phone: +60-1111-029295</p>
            </div>

            <div className="text-left">
              <h5 className="text-lg font-bold mb-2">Links</h5>
              <ul className="space-y-1">
                <li><Link to="/pdpa" className="hover:underline text-sm">PDPA</Link></li>
                <li><Link to="/gdpr" className="hover:underline text-sm">GDPR</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:underline text-sm">Terms & Conditions</Link></li>
                <li><Link to="/privacy-policy" className="hover:underline text-sm">Privacy Policy</Link></li>
                <li><Link to="/light-paper" className="hover:underline text-sm">Lite Paper</Link></li>
              </ul>
            </div>
          </div>

          {/* MarineTech Portal Link */}
          <div className="mt-4">
            <a href="https://www.marinetech.press/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:underline">
              <img src={MarineTech} alt="MarineTech" className="h-24" />
              <p className="text-xs mt-2">For Technical article please visit our MarineTech Portal</p>
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://www.facebook.com/people/CyberPort/61564157661366/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaFacebook className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/cyber-port-58bb33321/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="https://discord.gg/danNnHhTyt" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaDiscord className="w-5 h-5" />
            </a>
            <a href="https://t.me/+v0N25cMGLtsxZTRl" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaTelegramPlane className="w-5 h-5" />
            </a>
            <a href="https://reddit.com/r/CyberPortDigital/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaReddit className="w-5 h-5" />
            </a>
            <a href="https://github.com/Maritime-Systems" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaGithub className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs mt-4">
            <p>&copy; {new Date().getFullYear()} Maritime Information And Management Web Application: Virtual Cyberport For Maritime Monitoring And Tracking. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
