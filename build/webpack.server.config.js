const os = require('os')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const nodeExternals = require('webpack-node-externals')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const util = require('./util')
const config = require('../config')

const entries = {};

const entry = glob.sync(util.pathJoin('src/page/**/index.js'));

if(!entry){
  console.error('没有找到入口文件！请检查 src/page/**/index.js')
}

entry.forEach(function(page){
  let entryName = page.match(/page\/(\w+)\//)[1];
  entries[entryName] = ['babel-polyfill', `./page/${entryName}/index.js`];
  // if(config.env == 'dev'){
  //   entries[entryName].unshift('webpack/hot/only-dev-server', 'webpack-dev-server/client?http://localhost:'+ config.webpackPort)
  // }
})

module.exports = {
  entry: entries,
  // mode: config.env == 'dev' ? 'development' : 'production',
  mode: 'development',
  devtool: '#source-map',
  context: util.pathJoin('src'),
  output: {
    path: config.static.dir,
    publicPath: config.static.option.prefix || '',
    filename: 'view/[name].js',
    chunkFilename: 'view/[name].js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        use: [{
          loader: 'happypack/loader',
          options: { id: 'babel' }
        }],
        exclude: /node_modules/,
      },
      {
        test:/\.vue$/,
        use:'vue-loader'
      },
      //忽略掉不需要被打包进用于服务端的代码中去的文件
      {
        test: /\.(css|less|sass|styl|png|jpg|jpeg|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          path.join(__dirname, './loaders', 'ignore-loader.js')
        ]
      }
    ]
  },
  resolve: {
    alias: {
      asset: util.pathJoin('src/asset'),
      component: util.pathJoin('src/component'),
      entry: util.pathJoin('src/entry'),
      libs: util.pathJoin('src/libs'),
      page: util.pathJoin('src/page'),
    },
    extensions: ['.js', '.vue', '.styl', '.stylus', '.less', '.css', '.jsx', '.json', '.md'],
    // extensions: ['.js', '.vue', '.jsx']
  },
  externals: [
    // require file form node_modules
    nodeExternals({
      whitelist: [
        // 'jquery',
        // /\.jsx$/
      ]
    })
  ],
  plugins: [
    // new webpack.ProvidePlugin({
    //     jQuery: "jquery",
    //     $: "jquery"
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    //vue-loader 15版本后必须注册插件
    new VueLoaderPlugin(),
    // //增加第三方库
    new HappyPack(
      {
      id: "babel",
      verbose: true,
      loaders: [{
        path: 'babel-loader',
        options: {
          cacheDirectory: true
          //presets: ["env", "react", "stage-0"],
        }
      }],
      threadPool: happyThreadPool
    }),
    // new MiniCssExtractPlugin({
    //   filename: config.env !== 'dev' ? 'css/[name]_[hash:10].css' : 'css/[name].css',
    //   chunkFilename: config.env !== 'dev' ? 'css/[name]_[hash:10].css' : 'css/[name].css'
    // }),
    // JS优化
    new WebpackParallelUglifyPlugin({
      sourceMap: true,
      uglifyJS: {
        output: {
          beautify: true, //不需要格式化
          comments: true //不保留注释
        },
        // compress: {
        //   warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
        //   drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
        //   collapse_vars: true, // 内嵌定义了但是只用到一次的变量
        //   reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        // }
      }
    })
  ]
}