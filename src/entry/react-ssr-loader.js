/*
 * react render mixins for client and server
 */
const isClient = typeof window !== 'undefined'

const DOMRender = isClient ? require('react-dom') : require('react-dom/server')

module.exports = function (jsx, element){
  if(isClient){
    if(!element){
      element = document.getElementById('app')
    }else if(typeof element !== 'object' || !element.nodeType){
      element = document.getElementById(element)
    }
    DOMRender.render(jsx, element)
  } else {
    return DOMRender.renderToString(jsx)
    // return DOMRender.renderToStaticMarkup(jsx)
  }
}