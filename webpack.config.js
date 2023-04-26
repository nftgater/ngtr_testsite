const path = require('path')
const HtmlWebpackPlugin = require('./node_modules/html-webpack-plugin');
const webpack = require('./node_modules/webpack'); //to access built-in plugins

module.exports = {
  entry: './index.html',
  output: {
    filename: 'index.html',
    path: path.resolve(__dirname, 'dist')
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
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: [
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ],
  entry: {
    main: './index.html'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'main.js'
  },
  mode: "production"
}

