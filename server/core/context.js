/*
 * 扩展app context
 */

module.exports = ctx => {
  // 框架集成方法
  // ctx.params = () => {
  //   return Object.assign(ctx.param, ctx.query);
  // }
  // 自定义集成方法
  const matchFile = require('./matchFile')
  let extend = matchFile('extend')
  Object.keys(extend).forEach((item)=>{
    ctx[item] = extend[item]
  })
  return ctx
}
