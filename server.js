const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

import './src/css/main.css';
import './src/css/bootstrap.min.css'

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Fallback to index.html for single-page applications
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
