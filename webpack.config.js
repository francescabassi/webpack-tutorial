const validate = require('webpack-validator');

const config = {
  devtool: 'cheap-eval-source-map',
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
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    inline: true,
    open: true
  }
}

module.exports = validate(config);
