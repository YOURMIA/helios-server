const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const target = req.query.url;
    if (!target) return res.status(400).send('Missing URL parameter');
    try {
        const response = await fetch(target);
        let html = await response.text();
        // Simple rewrite for relative URLs
        html = html.replace(/href="\/([^"]*)"/g, `href="${target}/$1"`);
        html = html.replace(/src="\/([^"]*)"/g, `src="${target}/$1"`);
        res.send(html);
    } catch (err) {
        res.status(500).send('Error fetching target page');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));