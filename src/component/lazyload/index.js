/**
 * react-lazyload
 */
import React from 'react'
import ReactDOM from 'react-dom'
import BaseLazyload from './lazyload';
import webInject from 'web-inject';

const isClient = typeof window !== 'undefined'
//兼容node ssr
if(isClient){
  // 注入 animate style
  // fadein
  webInject.css(`
  .lazyload-animated {
    -webkit-animation-duration: 700ms;
    animation-duration: 700ms;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  .lazyload-fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }
  `)
}

class ImgLazyLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }
  componentDidMount(){
    //
  }
  onLazyLoad(component){
    // console.log('start load image.')
    let img = new Image(); //创建一个Image对象，实现图片的预下载
    img.src = this.props.src;
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
      this.loadedHandle()
      return; // 直接返回，不用再处理onload事件
    }
    img.onload = ()=> { //图片下载完毕时异步调用callback函数。
      this.loadedHandle()
    };
  }
  loadedHandle(){
    this.setState({
      loaded:true
    })
  }

  render() {
    let imgClassName=this.props.animate?`lazyload-animated lazyload-${this.props.animate}`:``
    return (
      <BaseLazyload {...this.props} onLazyLoad={this.onLazyLoad.bind(this)}>
        {this.state.loaded?<img className={imgClassName} src={this.props.src} />:this.props.placeholder}
      </BaseLazyload>
    );
  }
};

ImgLazyLoad.defaultProps = {
  placeholder:<div className="flex-row"><img src="/images/img-loading.gif" /></div>,
  animate:'fadeIn', //'fadein':透明度渐变 'blurIn':模糊渐变(参考知乎)
  once:true
};


/* 懒加载图片 */
export default ImgLazyLoad
/* 懒加载组件 */
export const LazyLoad = BaseLazyload

/* 自定义懒加载组件 */
const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

export const lazyload = (options = {}) => function lazyload(WrappedComponent) {
  return class LazyLoadDecorated extends Component {
    constructor() {
      super();
      this.displayName = `LazyLoad${getDisplayName(WrappedComponent)}`;
    }

    render() {
      return (
        <LazyLoad {...options}>
          <WrappedComponent {...this.props} />
        </LazyLoad>
      );
    }
  };
};