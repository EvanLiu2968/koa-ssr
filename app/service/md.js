const fs = require('fs')
const path = require('path')


// 配合 await同步读取文件
function readFileSync(dir){
  return new Promise((resolve,reject)=>{
    fs.readFile(dir,'utf-8',(err,data)=>{
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}

module.exports = app => {
  return class MdService extends app.Service {
    async getPhoto() {
      const { ctx, config } = this
      try{
        var res = await readFileSync(config.cloverDir + 'photo.json')
        return JSON.parse(res)
      }catch(e){
        this.logger.error(e);
        return {}
      }
    }
    async getBlog() {
      const { ctx, config } = this
      try{
        var res = await readFileSync(config.cloverDir + 'blog.json')
        return JSON.parse(res)
      }catch(e){
        this.logger.error(e);
        return {}
      }
    }
    async getMarkdown(file) {
      const { ctx, config } = this
      let mdStr = await readFileSync(config.cloverDir + file)
      return ctx.helper.markdown.render(mdStr)
    }
    async cloverHook() {
      const { ctx, config } = this
      var signature = ctx.req.headers['x-hub-signature']   //sha1=signature
      var event = ctx.req.headers['x-github-event']        //push
      var id = ctx.req.headers['x-github-delivery']        //commitID
      console.log('clover hook event: '+event)
      if(event == 'push'){
        let cwd = process.cwd()
        console.log('start run shell ：'+config.scriptsDir+'pullClover.sh')
        ctx.helper.runCmd('sh', [path.join(cwd,'scripts/pullClover.sh')], (res)=>{
          console.log(res)
        });
      }
    }
  }
}