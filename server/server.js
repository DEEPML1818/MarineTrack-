// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

const scrapeVesselData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.vesselfinder.com/ports/MYLBU001', {
    waitUntil: 'networkidle2',
  });

  const vesselData = await page.evaluate(() => {
    const tabs = ['Expected', 'Arrivals', 'Departures', 'In Port'];
    const data = {};

    tabs.forEach(tab => {
      data[tab] = [];
      document.querySelectorAll(`#${tab.toLowerCase()} .table-row`).forEach(row => {
        const eta = row.querySelector('.eta-column').innerText.trim();
        const vessel = row.querySelector('.vessel-column').innerText.trim();
        const type = row.querySelector('.type-column').innerText.trim();
        data[tab].push({ eta, vessel, type });
      });
    });

    return data;
  });

  await browser.close();
  return vesselData;
};

app.get('/api/vessel-data', async (req, res) => {
  try {
    const data = await scrapeVesselData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
