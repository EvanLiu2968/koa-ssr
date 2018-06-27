const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
// const pathToRegexp = require('path-to-regexp');
const logger = require('koa-logger')

module.exports = (app) => {
  const { config } = app;

  return logger()
};