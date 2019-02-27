const path = require("path");
const webpack = require("webpack");
const packagejson = require("./package.json");

const config = {
  entry: {
    first: "./src/first.js",
    second: "./src/second.js",
    vendor: Object.keys(packagejson.dependencies) // 获取生产环境依赖的库
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'runtime'],
      filename: '[name].js',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: '[name].js',
      chunks: ['first', 'second'] // 从first.js和second.js中抽取commons chunk
    })
  ]
}

module.exports = config;