const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Function to generate HtmlWebpackPlugin instances for each HTML file in a directory
function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir)).filter(file => file.endsWith('.html'));

  return templateFiles.map(file => {
    return new HtmlWebpackPlugin({
      template: path.resolve(__dirname, templateDir, file),
      filename: path.join(templateDir.replace('src/', ''), file)
    });
  });
}

module.exports = {
  entry: {
    main: './src/js/index.js',
    styles: './src/css/index.js'
  },
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
      "buffer": false,
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: 'src',
            outputPath: '/',
            publicPath: '/'
          }
        }
      }
    ]
  },
  plugins: [
    ...generateHtmlPlugins('src'),
    ...generateHtmlPlugins('src/creators')
  ],
  mode: 'production'
};
