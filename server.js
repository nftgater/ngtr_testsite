const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const srcPath = path.join(__dirname, 'src');

// Serve static files from the 'src' directory
app.use(express.static(srcPath));

// Dynamically generate routes for each HTML file in the 'src' directory
fs.readdirSync(srcPath).forEach(file => {
  if (file.endsWith('.html')) {
    const route = '/' + path.parse(file).name;
    app.get(route, (req, res) => {
      res.sendFile(path.join(srcPath, file));
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
