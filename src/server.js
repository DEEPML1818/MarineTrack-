// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/api/marine-news', async (req, res) => {
  try {
    const response = await axios.get('https://www.marinelink.com/news/');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
