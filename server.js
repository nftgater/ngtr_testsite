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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
