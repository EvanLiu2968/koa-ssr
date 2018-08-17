/*
 * tools or mixins
 */
const path = require('path')
const glob = require('glob')

/*
 * 根据match目录require对应模块
 */
function matchFile(dir){
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

module.exports = {
  matchFile,
}
