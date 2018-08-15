/* 
 * 首页
 */
import React from 'react'
import ssrLoader from 'entry/react-ssr-loader'
import './index.styl'

class App extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className="index-wrapper">
        <div className="box-image">
          <img src="/images/horse.png"/>
        </div>
        <div className="box-intro">
          <h1 className="title">Evan Liu</h1>
          <h2 className="subtitle">慎行，独思</h2>
          <ul className="column-list">
            <li><a href="https://github.com/EvanLiu2968" target="_blank">Github</a></li>
            <li><a href="https://evanliu2968.github.io" target="_blank">Gh-page</a></li>
            <li><a href="/images/weixin.jpg" target="_blank">微信</a></li>
            <li><a href="https://www.zhihu.com/people/evanliu2968" target="_blank">知乎</a></li>
          </ul>
          <ul className="column-list">
            <li><a href="/photo">Photo</a></li>
            <li><a href="/article">Article</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = ssrLoader(App)