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
    main: './src/js/index.js', 
    styles: './src/css/index.js'
  }, // Entry point is main.js in src/js directory
  output: {
      filename: '[name].bundle.js',
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
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: 'src',  // Keeps the original folder structure
            outputPath: 'assets/',  // Outputs images to dist/assets/
            publicPath: 'assets/'  // Ensures images are served from the correct path
          }
        }
      }
    ]
  },
  plugins: [
    // Generate HtmlWebpackPlugin instances dynamically for each HTML file in the src folder
    ...generateHtmlPlugins()
  ],
  mode: 'production'
};
