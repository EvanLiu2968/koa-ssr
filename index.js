/*
 * starter
 */

if(process.env.APP_ENV == 'dev'){
  require('./build')

  const nodemon = require('nodemon');
  const chalk = require('chalk');

  nodemon({
    "execMap": {
      "js": 'node --harmony ./app/core/init.js'
    },
    "script": './app/core/init.js',
    "ext": 'js html',
    "restartable": "rs",
    "verbose": true,
    "ignore": [
      "public/*",
      "dist/*",
      ".git/*",
      "*.db"
    ],
    "watch": [
      "app/*",
    ],
  });
  
  nodemon.on('start', function () {
    let log = 'server is starting';
    console.log(chalk.green(log + ' \n'))
  })
  .on('quit', function () {
    let log = 'server has quited';
    console.log(chalk.red('\n' + log + ' \n'))
    process.exit();
  })
  .on('restart', function (files) {
    if (!files) {
      return false
    }
    let log = `${files} changed`;
    console.log(chalk.yellow('\n' + log + ' \n'))
  });
}else{
  require('./app/core/init')
}