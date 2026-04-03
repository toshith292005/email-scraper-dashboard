const router = require('express').Router();

const {
    getEmails,
    getAllEmails,
    exportCSV,
    getStats
} = require('../controllers/scraperController');

// scrape emails
router.post('/scrape', getEmails);

// dashboard emails
router.get('/emails', getAllEmails);

// export CSV
router.get('/export', exportCSV);

// stats
router.get('/stats', getStats);

module.exports = router;