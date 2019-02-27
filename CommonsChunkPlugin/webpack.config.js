const path = require("path");
const webpack = require("webpack");
const packagejson = require("./package.json");

const config = {
  entry: {
    first: "./src/first.js",
    second: "./src/second.js",
    // vendor: Object.keys(packagejson.dependencies) // 获取生产环境依赖的库
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  plugins: [
    // 第二种方法把它们分离开来，就是利用minChunks作为函数的时候，说一下minChunks作为函数两个参数的含义：
    // - module：当前chunk及其包含的模块
    // - count：当前chunk及其包含的模块被引用的次数
    // minChunks作为函数会遍历每一个入口文件及其依赖的模块，返回一个布尔值，为true代表当前正在处理的文件（module.resource）合并到commons chunk中，为false则不合并。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].js',
      minChunks: function (module, count) {
        console.log(module.resource, `引用次数${count}`);
        // 有正在处理的文件 + 这个文件是.js后缀 + 这个文件是在 node_modules 中
        // 满足三个条件返回true，那么这个模块将被合并到commons chunk中
        // 比如 jquery.js，路径来自node_module：d:\xampp\htdocs\cielsys\webpack3\CommonsChunkPlugin\node_modules\jquery\dist\jquery.js 引用次数2
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, './node_module')) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      filename: '[name].js',
      chunks: ['vendor'] // 从first.js和second.js中抽取commons chunk
    })
  ]
}

module.exports = config;