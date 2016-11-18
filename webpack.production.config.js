const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    main: __dirname + "/src/main.js",
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.module.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css?modules")
      },
      {
        test: /^((?!\.module).)*css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.tmpl.html"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new CleanWebpackPlugin(["dist"], {
      root: process.cwd() // An absolute path for the root.
    }),
    new ExtractTextPlugin('[name].[chunkhash].css')
  ],
}
