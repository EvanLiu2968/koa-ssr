/**
 * react-pagination
 */
import React from 'react'

class Pagination extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pageSize: this.props.pageSize,
      totalRow: this.props.totalRow,
      pageCount: this.props.pageCount,
      currentPage: this.props.currentPage,
      inputPage: this.props.currentPage,
    }
  }
  componentWillReceiveProps(nextProps) {
    // 特殊情况下会在页面reRender，并会改变props此时state采用改变后的props
    if(this.props.totalRow!==nextProps.totalRow){
      this.setState({
        totalRow: nextProps.totalRow
      })
    }
    if(this.props.currentPage!==nextProps.currentPage){
      this.setState({
        currentPage: nextProps.currentPage
      })
    }
  }
  // componentWillMount() {
  // }
  // componentDidMount() {
  //   var node=ReactDOM.findDOMNode(this);
  // }
  onPageChange(page){
    const maxPage = Math.ceil(this.state.totalRow / this.state.pageSize)
    if(page<1 || page>maxPage || page==this.state.currentPage) {
      // alert('页码错误')
      return;
    };
    this.setState({
      currentPage:page
    })
    this.props.onCurrentChange.call(this,page,this.state)
  }
  onInputChange(e){
    var page = parseInt(e.target.value)
    if(!isNaN(page)){
      this.setState({
        inputPage:page
      })
    }
  }
  render(){
    const { currentPage, pageSize, pageCount, totalRow } = this.state
    let start = 0,len = 0;
    let startPager = [],endPager = [],middlePager = [];
    const maxPage = Math.ceil(totalRow / pageSize)
    if(currentPage < pageCount){
      start = 1
    }else if(currentPage >= pageCount){
      start = currentPage - 2
      if(start > maxPage - (pageCount-1)){
        start = maxPage - (pageCount-1)
      }
    }
    len = currentPage < (pageCount-1) ? pageCount : currentPage == (pageCount-1) ? (pageCount+1) : start + (pageCount-1)
    if(len > maxPage){
      len = maxPage;
      start = len - pageCount < 1 ? 1 :  len - pageCount
    }
    // start
    if(currentPage == pageCount){
      startPager.push(
        <li key="startPager1" className={`item pager-number`+(currentPage == 1?` pager-active`:``)} onClick={()=>this.onPageChange.call(this,1)}>{1}</li>,
        <li key="startPager-dot" className="pager-dot">...</li>
      )
    }else if(currentPage > pageCount){
      startPager.push(
        <li key="startPager1" className={`item pager-number`+(currentPage == 1?` pager-active`:``)} onClick={()=>this.onPageChange.call(this,1)}>{1}</li>,
        <li key="startPager2" className={`item pager-number`+(currentPage == 2?` pager-active`:``)} onClick={()=>this.onPageChange.call(this,1)}>{2}</li>,
        <li key="startPager-dot" className="pager-dot">...</li>
      )
    }
    // middle
    for(let i=start;i<=len;i++){
      middlePager.push(
        <li key={"middlePager"+i} className={`item pager-number`+(currentPage == i?` pager-active`:``)} onClick={()=>this.onPageChange.call(this,i)}>{i}</li>
      )
    }
    
    // end
    if(currentPage < maxPage - 2 && maxPage>pageCount){
      endPager.push(
        <li key="endPager-dot" className="pager-dot">...</li>
      )
      endPager.push(
        <li key="endPager" className="item pager-number" onClick={()=>this.onPageChange.call(this,maxPage)}>{ maxPage }</li>
      )
    }
    let prevPager = (
      <li key="prevPager" className={`item pager-prev`+(currentPage == 1?` pager-disabled`:``)} onClick={currentPage == 1 ? null: ()=>this.onPageChange.call(this,currentPage-1)}>上一页</li>
    )
    let nextPager = (
      <li key="nextPager" className={`item pager-next`+(currentPage == maxPage?` pager-disabled`:``)} onClick={currentPage == maxPage ? null: ()=>this.onPageChange.call(this,currentPage+1)}>下一页</li>
    )
    let jumpPager = (
      <li key="jumpPager" className="pager-jump">
        <span>共{ maxPage }页，前往</span>
        <input type="text" className="pager-input" value={this.state.inputPage} onChange={(e)=>{this.onInputChange.call(this,e)}} />页
        <button className="pager-confirm" onClick={()=>this.onPageChange.call(this,this.state.inputPage)}>确定</button>
      </li>
    )
    return (
      <div className={this.props.containerClass}>
        <ul className="hlist pagination-list">
          { prevPager }
          { startPager }
          { middlePager }
          { endPager }
          { nextPager }
          { this.props.showJumpPager && jumpPager }
        </ul>
      </div>
    )
  }
}

/*
 * 暂时不做下拉可选择分页大小的功能，后续如有需要再行扩展
 */
Pagination.defaultProps = {
  pageSize: 20, //分页大小
  totalRow: 0, //总数
  pageCount: 6, //总共显示的页码数(包括头尾,多余的省略号代替)-1
  currentPage: 1, //当前页码，默认第1页
  containerClass: 'pagination', //容器样式类名
  showJumpPager: true, //是否显示跳页功能
  // showPageSize: false, //是否显示分页选择，暂无此功能
  // pageSizes: [10, 20, 30, 40, 50, 100], //下拉分页的可选择显示数目，暂无此功能
  //Event
  onCurrentChange: function(currentPage,state){}, //currentPage 改变时会触发
  // onSizeChange: function(size){} //pageSize 改变时会触发，暂无此功能
};

export default Pagination
