const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const port = 3000;

// Enable gzip compression
app.use(compression());

// Cache static files for 1 day
const staticOptions = {
    maxAge: '1d',
    etag: true,
    lastModified: true
};

// Serve static files with caching
app.use(express.static(__dirname, staticOptions));

// Serve index.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`View site at http://localhost:${port}/`);
});
