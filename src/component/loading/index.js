/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

export default class Loading extends React.Component {
  componentWillUnmount() {
    this.enableScroll();
  }

  getStyle(){
    if (this.props.fullscreen) {
      this.disableScroll();

      return {
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

  render() {
    const { loading, fullscreen, text } = this.props;

    return (
      <div style={this.getStyle()} className={this.props.className}>
        { loading && (
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
        )}
        {this.props.children}
      </div>
    )
  }
}

// Loading.propTypes = {
//   loading: PropTypes.bool,
//   fullscreen: PropTypes.bool,
//   text: PropTypes.string
// };

Loading.defaultProps = {
  fullscreen: true,
  text: '正在加载中',
  loading: true
};
