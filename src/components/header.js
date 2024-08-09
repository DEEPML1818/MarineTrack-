import React, { useState } from 'react';
import headerImage from '../asset/Header.png';

const Header = ({ isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState('Labuan Port'); // Default selected port

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePortSelect = (port) => {
    setSelectedPort(port);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const ports = [
    'Port Klang',
    'Penang Port',
    'Johor Port',
    'Tanjung Pelepas Port',
    'Kuantan Port',
    'Bintulu Port',
    'Kuching Port',
    'Labuan Port',
    'Kemaman Port',
    'Pasir Gudang Port',
  ];

  return (
    <header className="bg-navy-900 text-white py-4 px-6 flex justify-between items-center relative">
      <img
        src={headerImage}
        alt="Header"
        className={`h-12 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-64' : 'translate-x-0'}`}
      />
      <div className="relative">
        <button onClick={toggleDropdown} className="focus:outline-none flex items-center">
          <span className="text-sm font-medium">{selectedPort}</span>
          <svg
            className="w-4 h-4 ml-1 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {ports.map((port) => (
              <a
                key={port}
                href="#"
                onClick={() => handlePortSelect(port)}
                className="block px-4 py-2 text-sm hover:bg-gray-200"
              >
                {port}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
