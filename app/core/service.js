/*
 * 加载service
 */

const { matchFile } = require('./tool');

module.exports = (app) => {
  const { config } = app;
  const service = {};
  let files = matchFile('service')
  Object.keys(files).forEach((item)=>{
    let Factory = typeof files[item] === 'function' ? files[item](app) : files[item]
    service[item] = new Factory(app)
  })
  return service
}