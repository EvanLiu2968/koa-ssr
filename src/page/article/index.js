/* 
 * Blog
 */
import React from 'react'
import ssrLoader from 'entry/react-ssr-loader'
import webInject from 'web-inject'
import axios from 'libs/axios'
import 'asset/css/reset.css'
import 'asset/css/markdown.css'
import './index.styl'

webInject.css('https://cdn.bootcss.com/highlight.js/9.12.0/styles/vs.min.css')

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mdHtml: '',
    }
  }
  componentDidMount(){
    axios({
      method: 'get',
      url:'/api/articles/README'
    }).then(res=>{
      this.setState({
        mdHtml: res
      })
    })
  }
  render(){
    return (
      <div className="wrapper">
        <header className="header">
          <div className="container">
            <div className="header-left">
              <a href="/"><img className="logo" src="/images/logo-text.png" /></a>
            </div>
            <div className="header-right">
              <ul className="md-category">
                <li key={'back'} onClick={()=>{history.go(-1)}}>返回</li>
              </ul>
            </div>
          </div>
        </header>
        <div className="main">
          <div className="container">
            <div className="md-content">
              <article className="markdown-body" dangerouslySetInnerHTML={{__html:this.state.mdHtml}}></article>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ssrLoader(App)