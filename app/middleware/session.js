'use strict';

const session = require('koa-session-minimal')
// const redis = require('koa-redis')

module.exports = (app) => {
  const { config } = app;
  return session({
    key: 'sessionKey',
    // store: redis({
    //   url: config.redis.url
    // }),
    // cookie options: maxAge, path, domain, secure, httpOnly
    cookie: {
      maxAge: 24 * 3600 * 1000,
      domain: config.domain
    }
  })
}