const path = require("path");
const webpack = require("webpack");

const config = {
  entry: {
    first: "./src/first.js",
    second: "./src/second.js",
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  }
}

module.exports = config;