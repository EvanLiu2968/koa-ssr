# pagination

分页组件


## 用法

```javascript
// @import "../../modules/pagination/index" //引入css
import Pagination from 'component/modules/pagination';
//分页参数
const pageOption = {
  currentPage: 1,
  pageSize: 20,
  totalRow: 1024,
  onCurrentChange:function(currentPage,state){
    alert(currentPage)
    console.log(state)
  }
}
//组件使用
ReactDOM.render(<Pagination {...pageOption} />,'paginationId')
```


## props

### currentPage || pageSize || totalRow

Type: Number Default: 1 || 20 || 0

当前页码数 || 每页条数 || 总数

### pageCount

Type: Number Default: 10

总共显示的页码数(包括头尾,多余的省略号代替)-1

### containerClass

Type: String Default: `paging`

容器样式类名

### onCurrentChange

Type: Function

```javascript
var option = {
  onCurrentChange:function(currentPage,state){
    alert(currentPage) //当前页码
    console.log(state) //当前分页状态的json，包括pageSize,totalRow,pageCount,currentPage
  }
}
```
返回参数当前页码currentPage



