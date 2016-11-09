const validate = require('webpack-validator');

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    inline: true,
    open: true
  }
}

module.exports = validate(config);
