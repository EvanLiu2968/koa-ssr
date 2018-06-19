# react-lazyload

按需懒加载图片或组件等


## 用法

```javascript
import ImgLazyLoad，{ LazyLoad } from 'component/modules/lazyload';
import MyComponent from './MyComponent';
/* 懒加载图片 */
const Img=(
  <div className="list">
    <ImgLazyLoad src='image.png' />
  </div>
)
/* 懒加载组件、jsx */
const LazyLoad=(
  <div className="list">
    <LazyLoad style={height:'200px'} offset={100} once onLazyLoad={callback}>
      <MyComponent />
    </LazyLoad>
  </div>
)
```
## 注意

开发组件或引入第三方组件时需要将import的React和ReactDom转换为已经全局内置的React和ReactDOM，不然有BUG

## props

### onLazyLoad

Type: Function

懒加载开始时的回调函数，参数为组件示例component

### style

Type: Number/String Default: undefined

无placeholder时默认的lazyload-placeholder的样式

### once

Type: Bool Default: false

仅加载一次，加载完无后续处理则使用该属性

### offset

Type: Number/Array(Number) Default: 0

视口距组件的距离，`200`指组件视口下方200px时执行加载

数组 `[200, 200]`可设置top offset &bottom offset,用于处理组件在视口上方的情况

### scroll

Type: Bool Default: true

监听scroll事件

### resize

Type: Bool Default: false

监听resize事件

### overflow

Type: Bool Default: false

组件位于overflow的容器内则设置true(即非window滚动事件)


### placeholder

Type: Any Default: undefined

懒加载未完成时的占位元素

### unmountIfInvisible

Type: Bool Default: false

懒加载content unmount时是否显示


### debounce/throttle

Type: Bool / Number Default: undefined

Number为delay的毫秒数

