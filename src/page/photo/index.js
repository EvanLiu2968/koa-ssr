/* 
 * Picture
 */
import React from 'react'
import ssrLoader from 'entry/react-ssr-loader'
import ImgLazyLoad from 'component/lazyload'
import Loading from 'component/loading'
import axios from 'libs/axios'
import 'asset/css/reset.css'
import './index.styl'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: true,
      photos: []
    }
  }
  componentDidMount(){
    axios.get('/getPhoto').then((res)=>{
      this.setState({
        loading: false,
        photos: res.photoList
      })
    })
  }
  render(){
    return (
      <div className="wrapper">
        <Loading loading={this.state.loading} fullscreen={this.state.loading}></Loading>
        <header className="header">
          <div className="container">
            <div className="header-left">
              <a href="/"><img className="logo" src="/images/logo-text.png" /></a>
            </div>
          </div>
        </header>
        <div className="main">
          <div className="container">
            <div className="picture-content">
              <div className="waterfall">
              {this.state.photos.map((item,i)=>{
                return (
                  <div key={i} className="waterfall-item">
                    <div className="img-box">
                      <ImgLazyLoad src={item.img} />
                      <div className="cover"></div>
                    </div>
                    <p className="description">{item.desc}</p>
                  </div>
                )
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ssrLoader(<App/>)