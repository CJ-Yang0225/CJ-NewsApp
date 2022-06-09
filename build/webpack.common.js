const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/js/index.js'),
    detail: path.resolve(__dirname, '../src/js/detail.js'),
    collections: path.resolve(__dirname, '../src/js/collections.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      title: '焦點新聞',
      chunks: ['index'],
      chunksSortMode: 'manual',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      excludeChunks: ['node_modules'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/detail.html'),
      filename: 'detail.html',
      title: '新聞內容',
      chunks: ['detail'],
      chunksSortMode: 'manual',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      excludeChunks: ['node_modules'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/collections.html'),
      filename: 'collections.html',
      title: '已收藏的新聞',
      chunks: ['collections'],
      chunksSortMode: 'manual',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      excludeChunks: ['node_modules'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|svg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name].[hash:7][ext]',
        },
      },
      {
        test: /\.(css|scss|sass)$/,
        // reverse order
        use: [
          'style-loader', // Creates `style` nodes from JS strings
          'css-loader', // Translates CSS into CommonJS
          {
            loader: 'postcss-loader', // Add vendor prefixes to CSS rules using autoprefixer
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader', // Compiles Sass/Scss to CSS
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
};
