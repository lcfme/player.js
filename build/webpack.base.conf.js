const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const __cwd = process.cwd();

function resolve(...args) {
  return path.resolve(__cwd, ...args);
}

module.exports = {
  entry: resolve('src'),
  output: {
    filename: 'light-player.js',
    path: resolve('out'),
    library: 'LightPlayer',
    libraryTarget: 'umd',
    publicPath: '.'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: resolve('src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
