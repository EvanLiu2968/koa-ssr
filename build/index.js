const webpack = require('webpack');
const ora = require('ora')
const path = require('path')
const chalk = require('chalk')
const util = require('./util')
const config = require('../config')
const nodemon = require('nodemon')
const WebpackDevServer = require('webpack-dev-server');
const WebpackDevServerOutput = require('./plugins/webpack-dev-server-output');

util.runCmd('sh', [path.join(config.scriptsDir,'clean.sh')], function(res){
  console.log(chalk.green(res + ' \n'))
});

if (process.env.APP_ENV == 'dev') {
  const webpackDevConfig = require('./webpack.dev.config');
  const compiler = webpack(webpackDevConfig)
  const server = new WebpackDevServer(compiler, webpackDevConfig.devServer);
  server.listen(webpackDevConfig.devServer.port, 'localhost', function (err, result) {
    if (err) throw err;
    console.log(`Listening at http://localhost:${config.webpackPort}`);
  })
  compiler.plugin('emit', function (compilation, callback) {
    console.log(chalk.cyan('  Compilation complete.\n'))
    callback();
  })

  if(config.serverSideRendering){
    const webpackServerConfig = require('./webpack.server.config');
    webpackServerConfig.plugins.unshift(new WebpackDevServerOutput(config.static.dir));
    const compiler = webpack(webpackServerConfig);
    new WebpackDevServer(compiler, webpackDevConfig.devServer).listen(webpackDevConfig.devServer.port+1, 'localhost', function (err, result) {
      if (err) throw err;
      console.log(`server restarting...`);
    })
    let restart = false
    compiler.plugin('emit', function (compilation, callback) {
      console.log(chalk.cyan('view for server  Compilation complete.\n'))
      callback();
      if(!restart){ //为了避免view没有生成之前nodemon就已经启动的情况，后续则需要手动触发app的change重启server
        nodemon.emit('restart')
      }
      restart = true;
    })
  }
  require('./nodemon')
} else {
  const webpackProdConfig = require('./webpack.prod.config');
  const spinner = ora('编译中...')
  spinner.start()
  webpack(webpackProdConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
  if(config.serverSideRendering){
    const webpackServerConfig = require('./webpack.server.config');
    spinner.start()
    webpack(webpackServerConfig, function (err, stats) {
      spinner.stop()
      if (err) throw err;
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
      console.log(chalk.cyan('Server side rendering build complete.\n'))
    })
  }
}