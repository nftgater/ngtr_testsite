const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Read all HTML files from the src directory
const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'src'))
  .filter(file => file.endsWith('.html'))
  .map(file => new HtmlWebpackPlugin({
    template: `./src/${file}`,
    filename: file
  }));

module.exports = {
  entry: './server.js', // Your main JavaScript entry point
  output: {
    filename: 'bundle.js', // Output bundled JavaScript file
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader' // Ensure both style-loader and css-loader are used
        ]
      }
    ]
  },
  plugins: [
    ...htmlFiles // Spread the array of HtmlWebpackPlugin instances
  ],
  mode: 'production'
};
