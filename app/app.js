/*
 * app
 */

module.exports = app => {
  const { config } = app;
  console.log('=== app开始启动 ===')
  // console.log(config)
  app.on('error', async function(error, ctx){
    console.log('error.stack: ');
    console.log(error.stack);
    console.log(await ctx.render('404'))
    if (ctx){
      ctx.body = await ctx.render('404');
    }
  })

  app.on('notFound', function(ctx){
    ctx.render('404');
  })

  app.on('started', function(){
    console.log('=== app启动完成 ===')
    console.log('listening at localhost:' + config.port)
  })
}