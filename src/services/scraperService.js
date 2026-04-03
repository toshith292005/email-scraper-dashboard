const axios = require('axios');
const cheerio = require('cheerio');

const scrapeEmails = async (url) => {
    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        // get full page text
        const text = $('body').text();

        // email regex
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;

        const emails = text.match(emailRegex) || [];

        // remove duplicates
        const uniqueEmails = [...new Set(emails)];

        return uniqueEmails;

    } catch (error) {
        throw new Error("Error scraping website");
    }
};

module.exports = { scrapeEmails };