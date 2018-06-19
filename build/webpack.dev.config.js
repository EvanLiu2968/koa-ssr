const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
const util = require('./util')
const baseWebpackConfig = require('./webpack.base.config')
const WebpackDevServerOutput = require('./plugins/webpack-dev-server-output');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const config = require('../config')

module.exports = merge(baseWebpackConfig, {
  devtool: 'eval-source-map',
  plugins: [
    /*设置热更新*/
    new webpack.HotModuleReplacementPlugin(),
    new WebpackDevServerOutput(config.static.dir),
    new BrowserSyncPlugin(
      {
        reloadDelay: 1000,
        proxy: {
          target: 'http://localhost:'+config.webpackPort,
          ws: true
        },
        files: [util.pathJoin(config.static.dir) + '/**'],
        logFileChanges: false,
        notify: false,
        injectChanges: true,
        host: 'localhost',
        port: 3000
      },
      {
        reload: false
      }
    )
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    historyApiFallback: true,
    clientLogLevel: "info",
    stats: { colors: true },
    hot: true,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    // contentBase: config.static.dir,
    host: '127.0.0.1',
    port: config.webpackPort,
    proxy: {
      '*': {
        target: 'http://localhost:' + config.port,
        secure: false,
        // pathRewrite: {
        //   '^/public': '',
        // },
        changeOrigin: true
      }
    },
    overlay: true
  }
});
