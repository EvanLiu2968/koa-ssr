/*
 * 初始化app
 */
const CoreApplication = require('./application')
const Router = require('koa-router')
const static = require('koa-static-cache')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const cors = require('kcors')
const etag = require('koa-etag')
const debug = require('debug')('app')
const path = require('path')

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

const app = new CoreApplication()

const config = require(path.join(process.cwd(), 'config'))
config.baseDir = config.baseDir || process.cwd();

app.config = config
app.keys = config.keys;

app.router = new Router();
app.controller = require('./controller')(app);
app.service = require('./service')(app);

require('../app')(app);

app.use(async (ctx, next)=>{
  await next()
  if (ctx.fresh) {
    ctx.status = 304;
    ctx.body = null;
  }
  if(ctx.status == 404){
    await config.notfound.call(ctx, ctx)
  }
})
app.use(async (ctx, next)=>{
  try{
    await next()
  } catch(e) {
    console.log(e.stack);
    await config.onerror.call(ctx, e, ctx)
  }
})

app.use(etag())

app.use(static(config.static.dir, config.static.option))

app.use(views(config.views.dir, config.views.option))

require('./middleware')(app, 'preMiddleware');

app.use(bodyparser(config.bodyparser.option))

app.use(cors(config.cors.option))

require('../router')(app);
app.use(app.router.routes());
app.use(app.router.allowedMethods());

require('./middleware')(app, 'postMiddleware');

app.on('error', async (err, ctx) => {
  debug(err.stack)
})

app.listen(config.port, (error, status) => {
  if(error) {
    console.log(error)
  }
  app.emit('started')
})