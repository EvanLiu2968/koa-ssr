const path = require('path')

const util = {};

util.pathJoin = function(src){
  return path.join(__dirname, '../', src)
}
// 运行shell
util.runCmd = function(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var res = "";

  child.stdout.on('data', function(buffer) { res += buffer.toString(); });
  child.stdout.on('end', function() { callback (res) });
}

module.exports = util