const API = "http://localhost:3000/api";

// load emails
async function loadEmails() {
    try {
        const search = document.getElementById("searchInput").value;
        const domain = document.getElementById("domainInput").value;

        let url = `${API}/emails?`;

        if (search) url += `search=${search}&`;
        if (domain) url += `domain=${domain}`;

        const res = await fetch(url);
        const data = await res.json();

        const table = document.getElementById("emailTable");
        table.innerHTML = "";

        if (data.emails.length === 0) {
            table.innerHTML = `<tr><td colspan="2">No emails found</td></tr>`;
            return;
        }

        data.emails.forEach(e => {
            table.innerHTML += `
                <tr>
                    <td>${e.email}</td>
                    <td>${e.source}</td>
                </tr>
            `;
        });

    } catch (err) {
        alert("Error loading emails");
        console.error(err);
    }
}

// scrape emails
async function scrapeEmails() {
    try {
        const urlInput = document.getElementById("urlInput").value;

        if (!urlInput) {
            alert("Please enter a URL");
            return;
        }

        // loading feedback
        const btn = event.target;
        btn.innerText = "Scraping...";
        btn.disabled = true;

        const res = await fetch(`${API}/scrape`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: urlInput })
        });

        const data = await res.json();

        alert(`Scraped: ${data.scraped}, Saved: ${data.saved}`);

        btn.innerText = "Scrape";
        btn.disabled = false;

        loadEmails();

    } catch (err) {
        alert("Error scraping website");
        console.error(err);
    }
}

// export CSV
function exportCSV() {
    window.open(`${API}/export`);
}

// load on start
loadEmails();