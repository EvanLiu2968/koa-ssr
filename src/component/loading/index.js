/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: props.loading,
      fullscreen: props.fullscreen,
      mounted: false,
    };
  }
  componentWillUnmount() {
    this.enableScroll();
  }
  componentDidMount() {
    this.setState({
      mounted: true
    });
  }

  getStyle(){
    if (this.state.fullscreen) {
      this.disableScroll();

      return {
        display: this.state.loading ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 99999
      }
    } else {
      this.enableScroll();

      return {
        position: 'relative'
      }
    }
  }

  documentBody() {
    if(typeof window !== 'undefined')
    return document.body;
  }

  disableScroll() {
    const documentBody = this.documentBody();
    if (documentBody) {
      documentBody.style.setProperty('overflow', 'hidden');
    }
  }

  enableScroll() {
    const documentBody = this.documentBody();
    if (documentBody) {
      documentBody.style.removeProperty('overflow');
    }
  }
  show(){
    this.setState({
      loading: true
    })
  }
  hide(){
    this.setState({
      loading: false
    })
    if (this.state.fullscreen) {
      this.enableScroll();
    }
  }

  render() {
    const { loading, fullscreen } = this.state;
    const { text } = this.props;

    return (
      <div style={this.getStyle()} className={this.props.className}>
        <div
          style={{
            display: 'block',
            position: 'absolute',
            zIndex: 657,
            backgroundColor: 'rgba(255, 255, 255, 0.901961)',
            margin: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}>
          <div className={'el-loading-spinner'+(fullscreen?' is-full-screen':'')} style={{
            position: 'absolute',
            display: 'inline-block',
            left: 0
          }}>
            <svg className="circular" viewBox="25 25 50 50">
              <circle className="path" cx="50" cy="50" r="20" fill="none" />
            </svg>
            {
              text && <p className="el-loading-text">{text}</p>
            }
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

Loading.propTypes = {
  loading: PropTypes.bool,
  fullscreen: PropTypes.bool,
  text: PropTypes.string
};

Loading.defaultProps = {
  fullscreen: true,
  text: '正在加载中',
  loading: true
};

export default Loading

var component = null, div = null;
export const loading = {
  show: function(){
    div = document.createElement('div');
    document.body.appendChild(div);
    component = new Loading({
      fullscreen: true,
      text: '正在加载中',
      loading: true
    });
    ReactDOM.render(component.render(), div);
  },
  hide: function(){
    if(div){
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      document.body.style.removeProperty('overflow');
      div = null;
      component = null;
    }
  }
}