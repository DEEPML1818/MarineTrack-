// src/components/MarineNews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MarineNews = () => {
  const [news, setNews] = useState([]);

  
  const MarineNewsUrl = "https://gcaptain.com/?s=Malaysia"; // Marinenews

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', overflow: 'hidden' }}>
      <iframe
        src={MarineNewsUrl}
        style={{
          width: '100%',
          height: '900px', // Set this to a height that includes the desired portion
          border: 'none',
          position: 'absolute',
          overflow: '',
          top: '-150px', // Adjust this to position the desired portion in view
        }}
        title="marinelink"
      />
    </div>
  );
};


export default MarineNews;
