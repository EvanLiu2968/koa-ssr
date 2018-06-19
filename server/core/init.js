/*
 * 初始化app
 */
const Koa = require('./application')
const Router = require('koa-router')
const static = require('koa-static-cache')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('kcors')
const etag = require('koa-etag')
const debug = require('debug')('app')

Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

const app = new Koa()

const config = require('../../config')
app.config = config
app.router = new Router();

require('../app')(app);

app.keys = config.keys;

app.use(async (ctx, next)=>{
  await next()
  if (ctx.fresh) {
    ctx.status = 304;
    ctx.body = null;
  }
})

app.use(etag())

app.use(static(config.static.dir, config.static.option))

app.use(views(config.views.dir, config.views.option))

require('./middleware')(app, 'preMiddleware');

app.use(bodyparser())

app.use(logger())

app.use(cors())

require('../router')(app);
app.use(app.router.routes());
app.use(app.router.allowedMethods());

require('./middleware')(app, 'postMiddleware');

app.on('error', async (err, ctx) => {
  debug(err.stack)
})

app.listen(config.port, (err, status) => {
  if(err) logger.error('app start error', err);
  console.log('listening at localhost:' + config.port)
})