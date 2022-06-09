const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        // reverse order
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into separate files
          'css-loader', // Translates CSS into CommonJS
          {
            loader: 'postcss-loader', // Parses CSS and Adds vendor prefixes to CSS rules using autoprefixer
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader', // Compiles Sass/Scss to CSS
        ],
      },
    ],
  },
});
