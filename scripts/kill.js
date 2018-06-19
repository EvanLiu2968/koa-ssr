const childProcess = require('child_process');
const exec = childProcess.exec

function viewProcessMessage (name, cb) {
  let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return console.error(err)
    }
    stdout.split('\n').filter((line) => {
      let processMessage = line.trim().split(/\s+/)
      let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
      if (processName === name) {
        return cb(processMessage[1])
      }
    })
  })
}

viewProcessMessage('node.exe',function (msg) {
  //关闭匹配的进程
  process.kill(msg)
})

// mac
// shelljs.exec("ps -ef | grep node | awk '{print $2}' | xargs kill -9")
