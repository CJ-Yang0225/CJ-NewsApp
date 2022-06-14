const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

module.exports = {
  entry: {
    index: {
      import: path.resolve(__dirname, '../src/pages/index.js'),
      dependOn: 'common',
    },
    detail: {
      import: path.resolve(__dirname, '../src/pages/detail.js'),
      dependOn: 'common',
    },
    collections: {
      import: path.resolve(__dirname, '../src/pages/collections.js'),
      dependOn: 'common',
    },
    common: path.resolve(__dirname, '../src/assets/js/common.js'),
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
      title: '頭條新聞',
      chunks: ['index', 'common'],
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
      chunks: ['detail', 'common'],
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
      chunks: ['collections', 'common'],
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
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[hash:8][ext]',
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /.tpl$/,
        type: 'asset/source',
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
