/*
 * app
 */

module.exports = app => {
  const { config } = app;
  console.log('=== app开始启动 ===')
  // console.log(config)

  app.on('started', function(){
    console.log('=== app启动完成 ===')
    if(process.env.APP_ENV == 'dev'){
      console.log('or you can refresh localhost:' + config.browserSync.port)
    }else{
      console.log('listening at localhost:' + config.port)
    }
  })
}