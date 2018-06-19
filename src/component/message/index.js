import React from 'react';
import ReactDOM from 'react-dom';

import MessageBox from './MessageBox';
import Toast from './Toast';
/* MessageBox说明
  参数               说明                    类型                  默认值
  title              标题                   string                 提示
  message            消息正文内容            string/JSX/Component   
  type               消息类型，用于显示图标   string                无(可选success/info/warning/error)
  lockScroll         锁定body滚动            boolean              true
  showClose          是否显示关闭按钮         boolean              true
  showMask           是否显示背景遮罩         boolean              false
  showCancelButton   是否显示取消按钮         boolean              false(confirm为true)
  showConfirmButton  是否显示确定按钮         boolean              true
  cancelButtonText   取消按钮的文本内容       string               取消
  confirmButtonText  确定按钮的文本内容       string               确定
  cancelButtonClass  取消按钮的自定义类名     string
  confirmButtonClass 确定按钮的自定义类名     string
  messageBoxClass    消息弹框的自定义类名     string
*/
function alert(message, props) {
  // if (typeof title === 'object') {
  //   props = title;
  // }

  props = Object.assign({ message,
    modal: 'alert',
    closeOnPressEscape: false,
    closeOnClickModal: false
  }, props);

  return next(props);
}

function confirm(message, props) {

  props = Object.assign({ message,
    modal: 'confirm',
    showCancelButton: true
  }, props);

  return next(props);
}

function msg(message, props) {

  props = Object.assign({ message,
    modal: 'msg',
    title:'',
    showCancelButton: false,
    showConfirmButton: false
  }, props);
  return next(props);
}

function next(props) {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');

    document.body.appendChild(div);

    if (props.lockScroll != false) {
      document.body.style.setProperty('overflow', 'hidden');
    }

    const component = React.createElement(MessageBox, Object.assign({}, props, {
      promise: { resolve, reject },
      onClose: () => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
        document.body.style.removeProperty('overflow');

        if (props.onClose instanceof Function) {
          props.onClose();
        }
      }
    }));

    ReactDOM.render(component, div);
  });
}

const Message=next;
Message.alert=alert;
Message.confirm=confirm;
Message.msg=msg;
//将消息提示直接挂载在Message
Message.notice=Toast;

export default Message
