const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

const meta = {
  name: 'CJ News App',
  description:
    '「CJ News App」匯集了台灣各方媒體的新聞報導，提供您多元的時事報導。',
};

module.exports = {
  entry: {
    index: {
      import: path.resolve(__dirname, '../src/pages/index.js'),
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
      name: meta.name,
      description: meta.description,
      title: 'CJ News App－頭條新聞',
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
      chunks: ['common', 'index'],
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
      name: meta.name,
      description: meta.description,
      title: 'CJ News App－已收藏的新聞',
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
      chunks: ['common', 'collections'],
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
        test: /\.tpl$/,
        type: 'asset/source',
        exclude: /node_modules/,
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
