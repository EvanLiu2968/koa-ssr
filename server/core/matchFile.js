/*
 * 根据match目录require对应模块
 */
const path = require('path')
const glob = require('glob')

module.exports = function(dir){
  let files = glob.sync(path.join(__dirname, '../', dir+'/**.js'));
  let match = {};
  if(files){
    files.forEach((item)=>{
      let fileName = item.match(/\/(\w+).js$/)[1];
      match[fileName] = require(item)
    })
  }
  return match
}
