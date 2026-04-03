const express = require('express');
const cors = require('cors');

const scraperRoutes = require('./routes/scraperRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', scraperRoutes);

app.get('/', (req, res) => {
    res.send("Email Scraper API Running 🚀");
});

module.exports = app;