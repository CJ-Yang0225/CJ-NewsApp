const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        // reverse order
        use: [
          'style-loader', // Creates `style` nodes from JS strings
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles Sass/Scss to CSS
        ],
      },
    ],
  },
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
    port: 3000,
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
  },
});
