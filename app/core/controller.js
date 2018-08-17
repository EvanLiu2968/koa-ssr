/*
 * 加载controller
 */

const { matchFile } = require('./tool');

module.exports = (app) => {
  const { config } = app;
  const controller = {};
  let files = matchFile('controller')
  Object.keys(files).forEach((item)=>{
    let Factory = typeof files[item] === 'function' ? files[item](app) : files[item]
    controller[item] = new Factory(app)
  })
  return controller
}