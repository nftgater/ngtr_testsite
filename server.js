const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

/* testing this fucking things up
// Fallback to index.html for single-page applications
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
*/


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/test-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'test-page.html'));
});

app.get('/creators/unnimagnum', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', '/creators/unnimagnum.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
