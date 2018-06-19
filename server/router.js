/*
 * router
 */
const path = require('path');

module.exports = app => {
  const { router, config } = app;
  // page route
  router.get('/', async function(ctx, next) {
    return await ctx.render('index', {
      title: `首页 - ${config.siteName}`,
      keywords: `首页`,
      description: `首页`,
    })
  });
  router.get('/article', async function(ctx, next) {
    return await ctx.render('article', {
      title: `文章 - ${config.siteName}`,
      keywords: `文章`,
      description: `文章`,
    })
  });
  router.get('/photo', async function(ctx, next) {
    return await ctx.render('photo', {
      title: `照片 - ${config.siteName}`,
      keywords: `照片`,
      description: `照片`,
    })
  });
  // api control
  router.get('/getPhoto', async function(ctx, next) {
    try{
      var res = await ctx.helper.readFileSync(config.cloverDir + 'photo.json')
      ctx.body = JSON.parse(res)
    }catch(e){
      console.log(e)
      ctx.body = {}
    }
  });
  router.get('/getBlog', async function(ctx, next) {
    try{
      var res = await ctx.helper.readFileSync(config.cloverDir + 'blog.json')
      ctx.body = JSON.parse(res)
    }catch(e){
      console.log(e)
      ctx.body = {}
    }
  });
  router.get('/getMarkdown', async function(ctx, next) {
    try{
      let file = ctx.query.file //中文部分需要encode
      let mdStr = await ctx.helper.readFileSync(config.cloverDir + file)
      ctx.body = ctx.helper.markdown.render(mdStr)
    }catch(e){
      console.log(e)
      ctx.error()
    }
  });

  router.post('/cloverHook', async function(ctx, next) {
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
  });
}