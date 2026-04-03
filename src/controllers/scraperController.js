const { scrapeEmails } = require('../services/scraperService');
const Email = require('../models/Email');
const { Parser } = require('json2csv');

// ================= SCRAPE + SAVE =================
exports.getEmails = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }

        const emails = await scrapeEmails(url);

        let savedCount = 0;

        for (let email of emails) {
            try {
                await Email.create({
                    email,
                    source: url
                });
                savedCount++;
            } catch (err) {
                // ignore duplicates
            }
        }

        res.json({
            scraped: emails.length,
            saved: savedCount,
            message: "Emails processed successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= GET ALL EMAILS =================
exports.getAllEmails = async (req, res) => {
    try {
        const { search, domain } = req.query;

        let filter = {};

        if (search) {
            filter.email = { $regex: search, $options: 'i' };
        }

        if (domain) {
            filter.email = {
                $regex: `@${domain}`,
                $options: 'i'
            };
        }

        const emails = await Email.find(filter);

        res.json({
            count: emails.length,
            emails
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= EXPORT CSV =================
exports.exportCSV = async (req, res) => {
    try {
        const emails = await Email.find();

        const parser = new Parser({ fields: ['email', 'source'] });
        const csv = parser.parse(emails);

        res.header('Content-Type', 'text/csv');
        res.attachment('emails.csv');
        res.send(csv);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= STATS =================
exports.getStats = async (req, res) => {
    try {
        const stats = await Email.aggregate([
            {
                $project: {
                    domain: {
                        $arrayElemAt: [
                            { $split: ["$email", "@"] },
                            1
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$domain",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(stats);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};