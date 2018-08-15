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
      category: [],
      active: '',
      mdList: [],
      mdHtml: '',
      mdShow: false
    }
    this.renderMarkdown.bind(this)
    this.renderMdList.bind(this)
  }
  componentDidMount(){
    axios({
      method: 'get',
      url: '/api/getBlog',
      loading: true
    }).then((res)=>{
      this.baseUrl = res.baseUrl
      this.setState({
        category: res.category
      })
      this.renderMdList( res.category[0].category,res.category[0].children)
    })
  }
  renderMarkdown(category,item){
    let file = category +'/' +item.src
    axios({
      method: 'get',
      url: '/api/getMarkdown',
      params: {
        file: file
      },
      loading: true
    }).then((res)=>{
      this.setState({
        mdHtml: res,
        mdShow: true
      })
    })
  }
  renderMdList(category,list){
    if(this.state.mdShow || this.state.active!==category){
      this.setState({
        active: category,
        mdList: list,
        mdHtml: '',
        mdShow: false
      })
    }
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
                {this.state.category.map((item,i)=>{
                  return <li key={i} className={this.state.active==item.category?'active':''} onClick={()=>{this.renderMdList(item.category,item.children)}}>{item.title}</li>
                })}
              </ul>
            </div>
          </div>
        </header>
        <div className="main">
          <div className="container">
            <div className="md-content">
              {this.state.mdShow ? (
                <article className="markdown-body" dangerouslySetInnerHTML={{__html:this.state.mdHtml}}></article>
              ) : (
                <ul className="md-list">
                  {this.state.mdList.map((item,i)=>{
                    return (
                      <li key={i} onClick={()=>{this.renderMarkdown(this.state.active,item)}}>
                        <h3 className="md-title">{item.title}</h3>
                        <div className="md-desc">
                          <span className="md-time">{item.createTime}</span>
                          {item.keywords.map((keyword,k)=>{
                            return <span key={k} className="md-tag">{keyword}</span>
                          })}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ssrLoader(App)