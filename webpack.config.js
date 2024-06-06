const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Function to generate HtmlWebpackPlugin instances for each HTML file in the src folder
function generateHtmlPlugins() {
  const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'src')).filter(file => file.endsWith('.html'));

  return htmlFiles.map(file => {
    return new HtmlWebpackPlugin({
      template: `./src/${file}`,
      filename: file,
    });
  });
}

module.exports = {
  entry: {
    main: './src/js/main.js', 
    styles: './src/css/main.css'
  }, // Entry point is main.js in src/js directory
  output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  resolve: {
    fallback: {
      "zlib": require.resolve('browserify-zlib'),
      "crypto": require.resolve("crypto-browserify"), 
      "buffer": false, // was: require.resolve("buffer"), 
      "vm": require.resolve("vm-browserify"), 
      "stream": require.resolve("stream-browserify"), 
      "querystring": require.resolve("querystring-es3"), 
      "http": require.resolve("stream-http"), 
      "fs": false,
      "async_hooks": false, 
      "browser": false, 
      "net": false
    }
  },  
  module: {
    rules: [
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      }
    ]
  },
  plugins: [
    // Generate HtmlWebpackPlugin instances dynamically for each HTML file in the src folder
    ...generateHtmlPlugins()
  ],
  mode: 'production'
};
