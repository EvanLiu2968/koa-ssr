/**
 * react-lazyload
 * https://github.com/jasonslyvia/react-lazyload/blob/master/README.md
 */
import React from 'React';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { on, off } from '../utils/event';
import { passiveEvent } from '../utils/passiveEventSupport';
import { checkOverflowVisible, checkNormalVisible } from './utils/checkVisible';
import scrollParent from './utils/scrollParent';
import debounce from './utils/debounce';
import throttle from './utils/throttle';


const LISTEN_FLAG = 'data-lazyload-listened';
const listeners = [];
let pending = [];

/**
 * Detect if element is visible in viewport, if so, set `visible` state to true.
 * If `once` prop is provided true, remove component as listener after checkVisible
 *
 * @param  {React} component   React component that respond to scroll and resize
 */
const checkVisible = function checkVisible(component) {
  const node = ReactDOM.findDOMNode(component);
  if (!node) {
    return;
  }

  const parent = scrollParent(node);
  const isOverflow = component.props.overflow &&
                     parent !== node.ownerDocument &&
                     parent !== document &&
                     parent !== document.documentElement;
  const visible = isOverflow ?
                  checkOverflowVisible(component, parent) :
                  checkNormalVisible(component);
  if (visible) {
    // Avoid extra render if previously is visible
    if (!component.visible) {
      if (component.props.once) {
        pending.push(component);
      }

      component.visible = true;
      component.onLazyLoad();
    }
  } else if (!(component.props.once && component.visible)) {
    component.visible = false;
    if (component.props.unmountIfInvisible) {
      component.onLazyLoad();
    }
  }
};


const purgePending = function purgePending() {
  pending.forEach((component) => {
    const index = listeners.indexOf(component);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  });

  pending = [];
};

const lazyLoadHandler = () => {
  for (let i = 0; i < listeners.length; ++i) {
    const listener = listeners[i];
    checkVisible(listener);
  }
  // Remove `once` component in listeners
  purgePending();
};

// Depending on component's props
let delayType;
let finalLazyLoadHandler = null;


class LazyLoad extends React.Component {
  constructor(props) {
    super(props);

    this.visible = false;
  }

  componentDidMount() {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      if (React.Children.count(this.props.children) > 1) {
        console.warn('[react-lazyload] Only one child is allowed to be passed to `LazyLoad`.');
      }

      if (this.props.wheel) { // eslint-disable-line
        // console.warn('[react-lazyload] Props `wheel` is not supported anymore, try set `overflow` for lazy loading in overflow containers.');
      }

      // Warn the user if placeholder and height is not specified and the rendered height is 0
      if (!this.props.placeholder && this.props.height === undefined && ReactDOM.findDOMNode(this).offsetHeight === 0) {
        // console.warn('[react-lazyload] Please add `height` props to <LazyLoad> for better performance.');
      }
    }

    // It's unlikely to change delay type on the fly, this is mainly
    // designed for tests
    let needResetFinalLazyLoadHandler = false;
    if (this.props.debounce !== undefined && delayType === 'throttle') {
      console.warn('[react-lazyload] Previous delay function is `throttle`, now switching to `debounce`, try setting them unanimously');
      needResetFinalLazyLoadHandler = true;
    } else if (delayType === 'debounce' && this.props.debounce === undefined) {
      console.warn('[react-lazyload] Previous delay function is `debounce`, now switching to `throttle`, try setting them unanimously');
      needResetFinalLazyLoadHandler = true;
    }

    if (needResetFinalLazyLoadHandler) {
      off(window, 'scroll', finalLazyLoadHandler, passiveEvent);
      off(window, 'resize', finalLazyLoadHandler, passiveEvent);
      finalLazyLoadHandler = null;
    }

    if (!finalLazyLoadHandler) {
      if (this.props.debounce !== undefined) {
        finalLazyLoadHandler = debounce(lazyLoadHandler, typeof this.props.debounce === 'number' ?
                                                         this.props.debounce :
                                                         300);
        delayType = 'debounce';
      } else if (this.props.throttle !== undefined) {
        finalLazyLoadHandler = throttle(lazyLoadHandler, typeof this.props.throttle === 'number' ?
                                                         this.props.throttle :
                                                         300);
        delayType = 'throttle';
      } else {
        finalLazyLoadHandler = lazyLoadHandler;
      }
    }

    if (this.props.overflow) {
      const parent = scrollParent(ReactDOM.findDOMNode(this));
      if (parent && typeof parent.getAttribute === 'function') {
        const listenerCount = 1 + (+parent.getAttribute(LISTEN_FLAG));
        if (listenerCount === 1) {
          parent.addEventListener('scroll', finalLazyLoadHandler, passiveEvent);
        }
        parent.setAttribute(LISTEN_FLAG, listenerCount);
      }
    } else if (listeners.length === 0 || needResetFinalLazyLoadHandler) {
      const { scroll, resize } = this.props;

      if (scroll) {
        on(window, 'scroll', finalLazyLoadHandler, passiveEvent);
      }

      if (resize) {
        on(window, 'resize', finalLazyLoadHandler, passiveEvent);
      }
    }

    listeners.push(this);
    checkVisible(this);
  }

  shouldComponentUpdate() {
    return this.visible;
  }

  componentWillUnmount() {
    if (this.props.overflow) {
      const parent = scrollParent(ReactDOM.findDOMNode(this));
      if (parent && typeof parent.getAttribute === 'function') {
        const listenerCount = (+parent.getAttribute(LISTEN_FLAG)) - 1;
        if (listenerCount === 0) {
          parent.removeEventListener('scroll', finalLazyLoadHandler, passiveEvent);
          parent.removeAttribute(LISTEN_FLAG);
        } else {
          parent.setAttribute(LISTEN_FLAG, listenerCount);
        }
      }
    }

    const index = listeners.indexOf(this);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      off(window, 'resize', finalLazyLoadHandler, passiveEvent);
      off(window, 'scroll', finalLazyLoadHandler, passiveEvent);
    }
  }

  onLazyLoad() {
    this.forceUpdate();
    if(typeof this.props.onLazyLoad === 'function'){
      this.props.onLazyLoad(this)
    }
  }

  render() {
    return this.visible ?
           this.props.children :
             this.props.placeholder ?
                this.props.placeholder :
                <div style={this.props.style} className="lazyload-placeholder" />;
                // <div style={{ height: this.props.height }} className="lazyload-placeholder" />;
  }
}

// LazyLoad.propTypes = {
//   once: PropTypes.bool,
//   height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   offset: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
//   overflow: PropTypes.bool,
//   resize: PropTypes.bool,
//   scroll: PropTypes.bool,
//   children: PropTypes.node,
//   throttle: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
//   debounce: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
//   placeholder: PropTypes.node,
//   unmountIfInvisible: PropTypes.bool
// };

LazyLoad.defaultProps = {
  once: false,
  offset: 0,
  overflow: false,
  resize: false,
  scroll: true,
  unmountIfInvisible: false
};


export default LazyLoad;
export { lazyLoadHandler as forceCheck };