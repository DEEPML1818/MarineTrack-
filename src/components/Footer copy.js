import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaDiscord, FaTelegramPlane, FaReddit, FaGithub } from 'react-icons/fa';
import Logo from "../asset/Header.png";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-6">
            <img src={Logo} alt="Logo" className="h-12 mx-auto" />
          </div>

          {/* Contact Information and Important Links */}
          <div className="flex flex-wrap justify-center w-full mb-6">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h5 className="text-lg font-bold mb-2">Contact Us</h5>
              <p>Bandar Putera 2</p>
              <p>Klang, Selangor 41200</p>
              <p>Email: cyberport.digital@gmail.com</p>
              <p>Phone: +60-1111-029295</p>
            </div>

            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h5 className="text-lg font-bold mb-2">Important Links</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/pdpa" className="hover:underline">PDPA</Link>
                </li>
                <li>
                  <Link to="/gdpr" className="hover:underline">GDPR</Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/light-paper" className="hover:underline">Lite Paper</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.facebook.com/people/CyberPort/61564157661366/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/cyber-port-58bb33321/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="https://discord.gg/danNnHhTyt" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaDiscord className="w-6 h-6" />
            </a>
            <a href="https://t.me/+v0N25cMGLtsxZTRl" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaTelegramPlane className="w-6 h-6" />
            </a>
            <a href="https://reddit.com/r/CyberPortDigital/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaReddit className="w-6 h-6" />
            </a>
            <a href="https://github.com/Maritime-Systems" target="_blank" rel="noopener noreferrer" className="hover:underline">
              <FaGithub className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Maritime Information And Management Web Application: Virtual Cyberport For Maritime Monitoring And Tracking. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
