const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
  },
  devServer: {
    hot: true,
    open: false,
    compress: true,
    host: 'localhost',
    port: 3000,
    static: {
      directory: path.join(__dirname, '../public'),
    },
  },
});
