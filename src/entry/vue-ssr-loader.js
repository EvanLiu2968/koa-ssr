/*
 * vue render mixins for client and server
 */
const isClient = typeof window !== 'undefined'

module.exports = function (vm, element){
  if(isClient){
    if(!element){
      element = document.getElementById('app')
    }else if(typeof element !== 'object' || !element.nodeType){
      element = document.getElementById(element)
    }
    vm.$mount(element)
  } else {
    const DOMRender = require('vue-server-renderer').createRenderer()
    // 返回Promise可以配合await变成同步
    return new Promise((resolve,reject)=>{
      // Vue以回调的方式返回html有点坑
      DOMRender.renderToString(vm, (err, html) => {
        if (err){
          reject(err)
        }else{
          resolve(html) // => <div data-server-rendered="true">Hello World</div>
        }
      })
    })
  }
}