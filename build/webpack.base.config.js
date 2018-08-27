const os = require('os')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const util = require('./util')
const config = require('../config')

const entries = {}, htmlEntries = [];

const entry = glob.sync(util.pathJoin('src/page/**/index.js'));

if(!entry){
  console.error('没有找到入口文件！请检查 src/page/**/index.js')
}

entry.forEach(function(page){
  let entryName = page.match(/page\/(\w+)\//)[1];
  entries[entryName] = ['babel-polyfill', `./page/${entryName}/index.js`];
  if(config.env == 'dev'){
    entries[entryName].unshift('webpack/hot/only-dev-server', 'webpack-dev-server/client?http://localhost:'+ config.webpackPort)
  }
  let template = util.pathJoin('src/entry/layout.html');
  if (fs.existsSync(util.pathJoin(`src/page/${entryName}/index.html`))) {
    template = util.pathJoin(`src/page/${entryName}/index.html`)
  }
  htmlEntries.push(
    new HtmlWebpackPlugin({
      filename: `html/${entryName}.html`,
      template: template,
      inject: true,
      // hash: true,
      chunksSortMode: 'manual', // 'none' | 'auto' | 'dependency' | 'manual' | {Function}
      chunks: ['vendors', 'commons', entryName],
      env: config.env == 'dev' ? 'development' : 'production',
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: false
      }
    })
  )
})

module.exports = {
  entry: entries,
  mode: config.env == 'dev' ? 'development' : 'production',
  context: util.pathJoin('src'),
  output: {
    path: config.static.dir,
    publicPath: config.static.option.prefix || '',
    filename: config.env !== 'dev' ? 'js/[name]_[hash:10].js' : 'js/[name].js',
    chunkFilename: config.env !== 'dev' ? 'js/[name]_[hash:10].js' : 'js/[name].js',
    libraryTarget: 'umd'
  },
  optimization: {
    // runtimeChunk: {
    //     name: 'manifest'
    // },
    // minimizer: true, // mode为production是默认true
    splitChunks: { // cacheGroups为子配置项，其他均为公用配置项,公用配置项均可在子配置项中再次定义
      chunks: 'initial', // chunks范围, 'initial'只对入口文件处理, "all"对entry进行拆分
      // minSize: 30000,
      // minChunks: 1,
      // maxAsyncRequests: 5, // 最大异步请求chunks
      // maxInitialRequests: 3, // 最大初始化chunks
      cacheGroups: {
        vendors: {
          test: /react|react-dom|axios|lodash/,
          name: "vendors", //chunks id
          filename: config.env !== 'dev' ? 'js/[name]_[hash:10].js' : 'js/[name].js', //打包输出的name
          priority: 10, // 优先级
          enforce: true
        },
        default: false,
        commons: {
          test: /\.(?!(css|sass|scss|less|styl|stylus))$/, //排除css chunks，先一个页面一个css
          name: 'commons',
          filename: config.env !== 'dev' ? 'js/[name]_[hash:10].js' : 'js/[name].js',
          // minSize: 20000, //默认为 30000(30kb),公用业务代码大于这个尺寸则抽取出来
          // minChunks: 1, // 几个入口的公用代码
          // priority: 1, // 优先级
          reuseExistingChunk: true, //重用已存在chunk
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.html/,  // 配合htmlwebpackplugin
        use: {
          loader: 'html-loader',
          // options: { interpolate: true }
        }
      },
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
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader",
          "stylus-loader"
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images/', // 图片输出的路径
            limit: 5 * 1024,
            name: 'images/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
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
  // https://webpack.js.org/configuration/externals/#externals 外置化应用程序依赖模块，例如dll、cdn等
  // externals: {
  //   jquery: "commonjs2 jQuery",
  //   react: "React"
  // },
  plugins: [
    // //增加第三方库
    // new webpack.ProvidePlugin({
    //     jQuery: "jquery",
    //     $: "jquery"
    // }),
    //vue-loader 15版本后必须注册插件
    new VueLoaderPlugin(),
    //抽出样式
    new MiniCssExtractPlugin({
      filename: config.env !== 'dev' ? 'css/[name]_[hash:10].css' : 'css/[name].css',
      chunkFilename: config.env !== 'dev' ? 'css/[name]_[hash:10].css' : 'css/[name].css'
    }),
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
  ].concat(htmlEntries)
}