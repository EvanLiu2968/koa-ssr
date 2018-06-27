const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
// const pathToRegexp = require('path-to-regexp');

module.exports = (app) => {
  const { config } = app;
  let options = {
    '/proxy/github' :{
      target: 'https://api.github.com',
      changeOrigin: true,
      logLevel: 'debug',
      onError: function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
      },
      onProxyReq:function (proxyReq, req, res) {
        // add custom header or body to request
        // console.log('=======proxyReq')
        // console.log(proxyReq)
      },
      pathRewrite: {
        '^/proxy/github': '',
      }
    },
    '/proxy/douban' :{
      target: 'https://api.douban.com/v2',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/douban': '',
      },
      onProxyReq:function (proxyReq, req, res) {}
    },
  }

  return async function(ctx, next) {
    let isProxy = false;
    for (const route of Object.keys(options)) {
      if (ctx.path.indexOf(route)>-1) {
      // if (pathToRegexp(route).test(ctx.path)) {
        isProxy = true;
        k2c(httpProxy(options[route]))(ctx, next);
        break;
      }
    }
    if(!isProxy){
      await next();
    }
  };
};
