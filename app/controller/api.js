'use strict';
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

module.exports = app => {
  const { config } = app;
  if (!fs.existsSync(config.formidable.option.uploadDir)) {
    fs.mkdirSync(config.formidable.option.uploadDir, '0777');
  }
  function formDataParse(ctx) {
    return new Promise(function(resolve, reject){
      const form = new formidable.IncomingForm(config.formidable.option);
      form.parse(ctx.req, function(err, fields, files){
        if(err){
          reject(err)
          return;
        }
        resolve({
          fields,
          files
        })
      });
      form.on('progress', function(bytesReceived, bytesExpected) {
        // console.log(bytesReceived)
        // console.log(bytesExpected)
      });
      form.on('file', function(name, file) {
        // console.log(name)
        // console.log(file)
      });
    })
  }
  return class ApiController extends app.Controller {
    async getREADME(ctx) {
      try{
        let mdStr = await ctx.helper.readFileSync(config.baseDir + '/README.md')
        ctx.body = ctx.helper.markdown.render(mdStr)
      }catch(e){
        console.log(e)
        ctx.body = { message: '服务错误' }
      }
    }
    async cloverHook(ctx) {
      var sig   = ctx.req.headers['x-hub-signature']   //sha1=ef561ae7d40465d664e5f2e76be4441662bdb61d
      var event = ctx.req.headers['x-github-event']    //push
      var id    = ctx.req.headers['x-github-delivery'] //commitID:b146cddc-3291-11e8-9fb3-0148e5324b22
      if(event == 'push'){
        let cwd = process.cwd()
        ctx.helper.runCmd('sh', [path.join(cwd,'scripts/pullClover.sh')], function(res){
          console.log(res)
        });
      }
      ctx.body = { message: 'hello, github!' }
    }
    async saveBase64(ctx) {
      try{
        let base64 = ctx.request.body.base64;
        base64 = base64.replace(/^(data:image\/(png|jpg|jpeg);base64,)/,'')
        let imgPath = path.join(config.formidable.option.uploadDir, 'temp.jpg');
        fs.writeFileSync(imgPath, new Buffer(base64,'base64'))
        ctx.body = { message: '生成图片成功' }
      }catch(e){
        console.log(e)
        ctx.body = { message: '生成图片错误' }
      }
    }
    async saveFormData(ctx) {
      try{
        const { fields, files } = await formDataParse(ctx)
        let uploads = {};
        for(let file in files){
          uploads[file] = {
            name: files[file].name,
            type: files[file].type,
            size: files[file].size,
            path: files[file].path.replace(config.static.dir, ''),
          }
        }
        ctx.body = { message: '上传成功', data: {
          fields:fields,
          uploads:uploads
        } }
      }catch(e){
        console.log(e)
        ctx.body = { message: '上传错误' }
      }
    }
  };
};