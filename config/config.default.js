const path = require('path');
const fs = require('fs');

module.exports = {

  // baseDir: path.join(__dirname, '../'),
  siteName: 'EvanLiu',

  // 服务端口
  port: 9080,

  keys: 'EvanLiu_key',
  // 前置中间件
  preMiddleware: [
    'logger',
    'session',
    'httpProxy',
  ],
  // 后置中间件
  postMiddleware: [
    // 'react-ssr',
  ],

  // 静态资源路径
  static: {
    dir: path.join(__dirname, '../public'),
    option: {
      // maxAge: 1000 * 60 * 60 * 24 * 365,
      // index: '/public/html/index.html',
      prefix: '/',
      dynamic: true,
      buffer: process.env.APP_ENV == 'dev' ? false : true,
      gzip: true
    }
  },
  views: {
    dir: path.join(__dirname, '../public/html'),
    option: {
      extension: 'html',
      // engineSource: {
      //   foo: () => Promise.resolve('bar')
      // },
      map: {
        html: 'handlebars'
      }
    }
  },
  // 默认首页
  root: 'index',
  // koa-bodyparse
  bodyparser: {
    option: {
      enableTypes: ['json', 'form'],
      encoding: 'utf-8',
      formLimit: "5mb",
      jsonLimit: "5mb",
      textLimit: "5mb"
    }
  },
  // 跨域资源共享 kros
  cors: {
    option: {
      origin: '*', // Access-Control-Allow-Origin default is request Origin header {String|Function(ctx)}
      // allowMethods: '', // Access-Control-Allow-Methods default is 'GET,HEAD,PUT,POST,DELETE,PATCH' {String|Array}
      // exposeHeaders: '', //Access-Control-Expose-Headers {String|Array}
      // allowHeaders: '',  //Access-Control-Allow-Headers {String|Array}
      // maxAge: 3000,  // Access-Control-Max-Age in seconds {String|Number}
      credentials: true, // Access-Control-Allow-Credentials
      // keepHeadersOnError: true, // Add set headers to `err.header` if an error is thrown
    }
  },
  onerror: async function(e, ctx){
    await ctx.render('404', {
      title: `500 - EvanLiu`,
      keywords: `500`,
      description: `500`,
    })
  },
  
  notfound: async function(ctx){
    await ctx.render('404', {
      title: `404 - EvanLiu`,
      keywords: `404`,
      description: `404`,
    })
  },

  // cloverDir: 'https://raw.githubusercontent.com/EvanLiu2968/clover/master/',
  cloverDir: path.join(__dirname, '../../clover/'),
  scriptsDir: path.join(__dirname, '../scripts/')
}