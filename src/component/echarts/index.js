/**
 * react-echarts (不支持node端同构)
 */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import webInject from 'web-inject'

const isClient = typeof window !== 'undefined'
if(isClient){
  var elementResizeEvent = require('../utils/element-resize-event')
}

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default class Echarts extends React.Component {
  constructor(props) {
    super(props);
    this.echarts = null; // the echarts object.
    this.echartsInstance = null; // the echarts instance.
    this.echartsElement = null; // echarts div element
  }

  // first add
  componentDidMount() {
    if(window.echarts){
      this.echarts = window.echarts
      this.echartsElement=ReactDOM.findDOMNode(this);
      this.rerender();
    }else{
      // cdn: http://www.bootcdn.cn/echarts/
      webInject.js(this.props.cdn,()=>{
        this.echarts = window.echarts
        this.echartsElement=ReactDOM.findDOMNode(this);
        this.rerender();
      })
    }
  }

  // update
  componentDidUpdate(prevProps) {
    const echartObj = this.renderEchartDom();
    this.bindEvents(echartObj, this.props.onEvents || {});

    // 切换 theme 的时候，需要 dispost 之后才新建
    if (this.props.theme !== prevProps.theme) {
      this.dispose();

      this.rerender(); // 重建
      return;
    }

    if (!isEqual(prevProps.style, this.props.style) || !isEqual(prevProps.className, this.props.className)) {
      try {
        echartObj.resize();
      } catch (_) {}
    }
  }

  // remove
  componentWillUnmount() {
    this.dispose();
  }

  // return the echart object
  getEchartsInstance = () => this.echarts.getInstanceByDom(this.echartsElement) ||
    this.echarts.init(this.echartsElement, this.props.theme);

  // dispose echarts and element-resize-event
  dispose = () => {
    if (this.echartsElement) {
      // if elementResizeEvent.unbind exist, just do it.
      try {
        elementResizeEvent.unbind(this.echartsElement);
      } catch (_) {}
      this.echarts.dispose(this.echartsElement);
    }
  };

  rerender = () => {
    const { onEvents, onChartReady } = this.props;

    const echartObj = this.renderEchartDom();
    this.bindEvents(echartObj, onEvents || {});
    // on chart ready
    if (typeof onChartReady === 'function') this.props.onChartReady(echartObj);
    // on resize
    if (this.echartsElement) {
      elementResizeEvent(this.echartsElement, () => {
        echartObj.resize();
      });
    }
  };

  // bind the events
  bindEvents = (instance, events) => {
    const _loopEvent = (eventName) => {
      // ignore the event config which not satisfy
      if (typeof eventName === 'string' && typeof events[eventName] === 'function') {
        // binding event
        instance.off(eventName);
        instance.on(eventName, (param) => {
          events[eventName](param, instance);
        });
      }
    };

    for (const eventName in events) {
      if (Object.prototype.hasOwnProperty.call(events, eventName)) {
        _loopEvent(eventName);
      }
    }
  };

  // render the dom
  renderEchartDom = () => {
    // init the echart object
    const echartObj = this.getEchartsInstance();
    // set the echart option
    echartObj.setOption(this.props.option, this.props.notMerge || false, this.props.lazyUpdate || false);
    // set loading mask
    if (this.props.showLoading) echartObj.showLoading(this.props.loadingOption || null);
    else echartObj.hideLoading();

    return echartObj;
  };

  render() {
    const { style = {}, className } = this.props;
    const newStyle = {
      height: 300,
      width: '100%',
      ...style,
    };
    // for render
    return (
      <div
        ref={(e) => { this.echartsElement = e; }}
        style={newStyle}
        className={`echarts-for-react ${className}`}
      />
    );
  }
}

Echarts.propTypes = {
  option: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  notMerge: PropTypes.bool,
  lazyUpdate: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  cdn: PropTypes.string,
  theme: PropTypes.string,
  onChartReady: PropTypes.func,
  showLoading: PropTypes.bool,
  loadingOption: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onEvents: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

Echarts.defaultProps = {
  option: {},
  notMerge: false,
  lazyUpdate: false,
  style: {},
  className: '',
  cdn: 'https://cdn.bootcss.com/echarts/3.8.5/echarts.min.js',
  theme: null,
  onChartReady: () => {},
  showLoading: false,
  loadingOption: null,
  onEvents: {},
};