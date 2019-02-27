const path = require("path");
const webpack = require("webpack");
// const packagejson = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin") // html打包插件
// const AutoDllPlugin = require('autodll-webpack-plugin'); // dll

const webpackConfig = {
  entry: {
    first: "./src/first.js",
    second: "./src/second.js",
    // vendor: Object.keys(packagejson.dependencies) // 获取生产环境依赖的库
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: "[name].[chunkhash].chunk.js"
  },
  plugins: [
    // 第二种方法把它们分离开来，就是利用minChunks作为函数的时候，说一下minChunks作为函数两个参数的含义：
    // - module：当前chunk及其包含的模块
    // - count：当前chunk及其包含的模块被引用的次数
    // minChunks作为函数会遍历每一个入口文件及其依赖的模块，返回一个布尔值，为true代表当前正在处理的文件（module.resource）合并到commons chunk中，为false则不合并。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[chunkhash].js',
      minChunks: function (module, count) {
        // console.log(module.resource, `引用次数${count}`);
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
    // 提取webpack的运行时代码，使其不影响vendor打包的hash变化
    // 这样，即使修改业务app代码，项目依赖的基础库vendor chunk也不会发生变化
    new webpack.optimize.CommonsChunkPlugin({
      name: ['runtime'],
      filename: '[name].[chunkhash].js',
      chunks: ['vendor'] // 从first.js和second.js中抽取commons chunk
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: 'children-async'
    }),
    /* new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'runtime'],
      filename: '[name].js',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: 'children-async'
    }), */
    new HtmlWebpackPlugin({
      hash: true,
      template: 'index.html'
    })
  ]
}

if (process.env.npm_config_generate_report || process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

  // 在线分析，打开浏览器
  if (process.env.npm_config_report) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8080,
        generateStatsFile: false
      })
    )
  }

  // 静态分析，只生成分析结果html
  if (process.env.npm_config_generate_report) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false
      })
    )
  }
}

module.exports = webpackConfig;