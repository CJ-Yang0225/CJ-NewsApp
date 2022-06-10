const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"', // JSON.stringify('development')
      },
    }),
  ],
  devServer: {
    hot: true,
    open: false,
    compress: true,
    host: 'localhost',
    port: 3000,
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
  },
});
