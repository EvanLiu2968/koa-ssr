/* @flow */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Transition from './transition';
import typeMap from './typeMap';


class Toast extends Component {

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

    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  className(...args) {
    return args.join(' ');
  }

  style(args) {
    return Object.assign({}, args, this.props.style)
  }

  onClose() {
    this.stopTimer();

    this.setState({
      visible: false
    }, () => {
      this.props.willUnmount();
    });
  }

  startTimer() {
  if (this.props.duration > 0) {
   this.timeout = setTimeout(() => {
    this.onClose();
   }, this.props.duration)
  }
  }

  stopTimer() {
    clearTimeout(this.timeout);
  }

  render() {
    const { type, customClass } = this.props;

    return (
      <Transition name="el-message-fade" duration="100">
        <div key={this.state.visible} style={{display:this.state.visible ? 'block':'none'}} className={this.className('el-message', customClass)} onMouseEnter={this.stopTimer.bind(this)} onMouseLeave={this.startTimer.bind(this)}>
          { type && <img className="el-message__img" src={typeMap[type]} /> }
          <div className="el-message__group">
            <p>{this.props.message}</p>
            { this.props.showClose && <div className="el-message__closeBtn" onClick={this.onClose.bind(this)}>X</div> }
          </div>
        </div>
      </Transition>
    )
  }
}

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'info', 'error']),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  duration: PropTypes.number,
  showClose: PropTypes.bool,
  customClass: PropTypes.string
}

Toast.defaultProps = {
  type: 'info',
  duration: 3000,
  showClose: false
}

export default function (props = {}, type) {
  const div = document.createElement('div');

  document.body.appendChild(div);

  if (typeof props === 'string' || React.isValidElement(props)) {
    props = {
      message: props
    };
  }

  if (type) {
    props.type = type;
  }

  const component = React.createElement(Toast, Object.assign(props, {
    willUnmount: () => {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);

      if (props.onClose instanceof Function) {
        props.onClose();
      }
    }
  }));

  ReactDOM.render(component, div);
}
/*Toast说明
  message      消息文字     string/ReactElement
  type         主题        string(success/warning/info/error) 默认info
  customClass  自定义类名   string
  duration     显示时间, 毫秒。设为 0 则不会自动关闭 number 默认3000
  showClose    是否显示关闭按钮 boolean — false
  onClose      关闭时的回调函数, 参数为被关闭的 message 实例 function
*/