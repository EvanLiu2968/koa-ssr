# searchForm

搜索组件


## 用法

```javascript
import SearchForm from 'component/modules/searchForm';
//组件参数
// props方法均已绑定this指向component实例，可使用方法见如下：属性及属性方法
const searchOption={
  containerClass:'search-wrap', //组件容器类名
  onSearchChange:function(value){
    // 搜索值变化的回调，参数为当前搜索值
    if(value){
      this.updateDropdown(
        <ul className="input-dropdown-ul">
          <li className="item">...搜索匹配值</li>
        </ul>
      )
    }else{
      this.updateDropdown(
        <div className="empty-box">
          <p className='empty-text'>{'对不起，找不到：'+value}</p>
        </div>
      )
    }
  },
  onSearchConfirm:function(value){
    // 搜索按钮或enter键的点击回调，参数为当前搜索值
    if(value){
      console.log(value)
    }else{
      alert('请输入搜索内容')
    }
  },
  onDidMount:function(dom){
    // 组件componentDidMount后的回调，参数为组件dom
    this.setValue('我是输入框')
    // 因为blur会和input-dropdown-ul的click事件冲突，事件触发顺序为keydown > mousedown > blur > keyup > mouseup > click
    $(dom).on('mousedown','.input-dropdown-ul>li',function(e){
      // 下拉区域的点击等逻辑在这里处理
    })
  }
};
//组件渲染
ReactDOM.render(<SearchForm {...searchOption}/>,'search')
```


## props

### containerClass

Type: String Default: 'search-wrap'

组件容器的样式，所有的样式控制通过这个类控制

### searchBtn

Type: Bool Default: true

是否显示搜索按钮

### searchBtnName

Type: String Default: '搜索'

搜索按钮的显示名称

### placeholder

Type: String

输入框的placeholder

### enterConfirm

Type: Bool Default: true

是否启用enter键搜索

### delay

Type: Number Default: 200

输入时延迟回调的毫秒数

### onSearchChange(value) || onSearchConfirm(value) || onDidMount(dom)

Type: Function

说明可参考示例用法，props方法均已绑定this指向component实例，可使用方法见如下：属性及属性方法

## 属性及属性方法

### this.searchInput

搜索组件的input标签dom

### this.searchBtn

搜索组件的搜索按钮标签dom

### this.updateDropdown

更新下拉列表内容，传参为 JSX || String

### this.setValue

更新搜索输入框值，传参为 value(String)

### this.showDropdown

显示下拉内容区

### this.hideDropdown

关闭下拉内容区