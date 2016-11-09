const validate = require('webpack-validator');

const config = {
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  }
}

module.exports = validate(config);
