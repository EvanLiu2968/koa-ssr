const path = require('path')
const glob = require('glob')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const util = require('./util')
const config = require('../config')

module.exports = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: [
    // JS优化
    new WebpackParallelUglifyPlugin({
      sourceMap: true,
      uglifyJS: {
        output: {
          beautify: false, //不需要格式化
          comments: true //不保留注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ]
});