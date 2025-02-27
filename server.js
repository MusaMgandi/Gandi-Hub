const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files from current directory
app.use(express.static(__dirname));

// Redirect root to Gandi-hub.html
app.get('/', (req, res) => {
    res.redirect('/Gandi-hub.html');
});

// Handle all other routes
app.get('*', (req, res) => {
    const requestedPath = path.join(__dirname, req.path);
    if (fs.existsSync(requestedPath)) {
        res.sendFile(requestedPath);
    } else {
        res.sendFile(path.join(__dirname, 'Gandi-hub.html'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`View site at http://localhost:${PORT}/Gandi-hub.html`);
});
