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
    // const DOMRender = require('vue-server-renderer').createRenderer()
    // return new Promise((resolve,reject)=>{ // 返回Promise可以配合await变成同步
    //   DOMRender.renderToString(vm, (e, html) => {
    //     if (e){
    //       reject(e)
    //     }else{
    //       resolve(html)
    //     }
    //   })
    // })
    return vm
  }
}