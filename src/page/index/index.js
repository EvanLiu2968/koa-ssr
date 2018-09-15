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
  componentDidMount(){
    console.log(this.props)
  }
  render(){
    return (
      <div className="index-wrapper">
        <div className="box-image">
          <img src="/images/horse.png"/>
        </div>
        <div className="box-intro">
          <h1 className="title">webpack4-plus-koa</h1>
          <h2 className="subtitle">A node project based on webpack4 and koa2.</h2>
          <ul className="column-list">
            <li><a href="/article">README</a></li>
            <li><a href="/test">Test</a></li>
            <li><a href="/error">Error</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

module.exports = ssrLoader(App)