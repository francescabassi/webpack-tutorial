const validate = require('webpack-validator');
var webpack = require('webpack');

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
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
        loader: 'style!css?modules'
      },
      {
        test: /^((?!\.module).)*css$/,
        loader: 'style!css'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true
  }
}

module.exports = validate(config);
