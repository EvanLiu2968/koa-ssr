const _ = require('lodash')
const path = require('path');
const fs = require('fs');

process.env.APP_ENV = process.env.APP_ENV || 'prod';
const APP_ENV = process.env.APP_ENV;

var config = require('./config.default');

if (fs.existsSync(path.join(__dirname, './config.'+ APP_ENV +'.js'))) {
  let env_config = require('./config.'+ APP_ENV +'.js')
  config = _.merge(config, env_config)
  config.env = APP_ENV;
}

module.exports = config;