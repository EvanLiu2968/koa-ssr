/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from './transition';
import typeMap from './typeMap';


export default class MessageBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    this.setState({
      visible: true
    })
  }

  confirmButtonText() {
    return this.props.confirmButtonText || '确定';
  }

  cancelButtonText() {
    return this.props.cancelButtonText || '取消';
  }

  className(...args) {
    return args.join(' ');
  }

  style(args) {
    return Object.assign({}, args, this.props.style)
  }

  handleAction(action) {
    const { modal, promise } = this.props;

    if (modal) {
      switch (action) {
        case 'cancel':
          promise.reject();
          break;
        case 'confirm':
          promise.resolve();
          break;
        default:
          break;
      }
    } else {
      promise.resolve(action);
    }

    this.close();
  }

  close() {
    this.setState({
      visible: false
    });

    setTimeout(() => {
      this.props.onClose();
    }, 200);
  }

  render() {
    return (
      <div>
        <div style={{ position: 'absolute', zIndex: 10021 }}>
          <Transition name="msgbox-fade" duration="300">
            <div key={this.state.visible} style={{display:this.state.visible ? 'block':'none'}} className="el-message-box__wrapper">
              <div className={this.className('el-message-box',this.props.messageBoxClass)}>
                {
                  this.props.showClose && (
                    <button type="button" className="el-message-box__headerbtn" aria-label="Close" onClick={this.handleAction.bind(this, 'cancel')}>
                      <span className="el-message-box__close">X</span>
                    </button>
                  )
                }
                {
                  this.props.title && (
                    <div className="el-message-box__header">
                      <div className="el-message-box__title">{this.props.title}</div>
                    </div>
                  )
                }
                {
                  this.props.message && (
                    <div className="el-message-box__content">
                      {
                        this.props.type &&(
                          <div className="el-message-box__status">
                            <img src={typeMap[this.props.type]} />
                          </div>
                        )
                      }
                      <div className="el-message-box__message" style={{ marginLeft: this.props.type ? '50px' : '0' }}>
                        <div>{this.props.message}</div>
                      </div>
                    </div>
                  )
                }
                {
                  (this.props.showCancelButton || this.props.showConfirmButton) && (
                    <div className="el-message-box__btns">
                      <button style={{display:this.props.showCancelButton ? 'inline-block':'none'}} type="button"  className={this.className('el-button',this.props.cancelButtonClass)} onClick={this.handleAction.bind(this, 'cancel')}>{this.cancelButtonText()}</button>
                      <button style={{display:this.props.showConfirmButton ? 'inline-block':'none'}} type="button" className={this.className('el-button','el-button--primary',this.props.confirmButtonClass)} onClick={this.handleAction.bind(this, 'confirm')}>{this.confirmButtonText()}</button>
                    </div>
                  )
                }
              </div>
            </div>
          </Transition>
        </div>
        {
          this.props.showMask && (
            <Transition name="v-modal" duration="200">
              <div key={this.state.visible} className="v-modal" style={{ zIndex: 1006,display:this.state.visible?'block':'none' }}></div>
            </Transition>
          )
        }
      </div>
    )
  }
}

MessageBox.propTypes = {
  modal: PropTypes.oneOf(['alert', 'confirm', 'msg']),
  type: PropTypes.oneOf(['success', 'warning', 'info', 'error']),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showClose: PropTypes.bool,
  showMask: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  messageBoxClass: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  cancelButtonClass: PropTypes.string,
  confirmButtonClass: PropTypes.string,
  promise: PropTypes.object,
  onClose: PropTypes.func
}

MessageBox.defaultProps = {
  title: '提示',
  showClose: true,
  showMask: true,
  showConfirmButton: true
}
