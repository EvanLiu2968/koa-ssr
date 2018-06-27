/*
 * 加载middleware
 */
const fs = require('fs')
const path = require('path')

module.exports = (app, middlewareType) => {
  const { config } = app;
  if(config[middlewareType] && typeof config[middlewareType] == 'object'){
    config[middlewareType].forEach(item => {
      let filePath = path.join(__dirname, '../middleware', item)
      if(fs.existsSync(filePath + '.js')){
        let ware = require(filePath)(app);
        app.use(ware)
      }else{
        console.error(`${filePath}.js 不存在，请移除${item}的middleware配置`)
      }
    })
  }
}
