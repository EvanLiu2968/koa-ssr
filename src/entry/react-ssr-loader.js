/*
 * react render mixins for client and server
 */
const isClient = typeof window !== 'undefined'
const React = require('react')
const DOMRender = isClient ? require('react-dom') : require('react-dom/server')

module.exports = function (App, element){
  if(isClient){
    if(!element){
      element = document.getElementById('app')
    }else if(typeof element !== 'object' || !element.nodeType){
      element = document.getElementById(element)
    }
    let props = {};
    if(window.__ROOT_PROPS__){
      props = window.__ROOT_PROPS__
      document.getElementById('rootProps').remove()
    }
    DOMRender.render(<App {...props}/>, element)
  } else {
    // return DOMRender.renderToString(jsx)
    // return DOMRender.renderToStaticMarkup(jsx)
    return App
  }
}