var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      "Promise" : "es6-promise",
      "fetch" : "imports?this=>global!exports?global.fetch!whatwg-fetch"
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/,
      include: __dirname
    },
    // {
    //   test: /\.css?$/,
    //   loader: 'style-loader!css-loader',
    //   //exclude: /node_modules/,
    //   include: __dirname
    // }
    ]
  }
};
