'use strict';

const logger = require('koa-logger')

module.exports = (app) => {
  const { config } = app;

  return logger()
};