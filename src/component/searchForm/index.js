import React from 'react'
import ReactDOM from 'react-dom'
import { on, off } from '../utils/event';
import { passiveEvent } from '../utils/passiveEventSupport';

class SearchForm extends React.Component {
  constructor(props){
    super(props)
    this.timer=null;
    this.dropdown='';
    this.state = {
      value:'',
      showDropdown:false
    }
  }
  componentDidMount() {
    this.dom=ReactDOM.findDOMNode(this);
    // onDidMount callback
    if(typeof this.props.onDidMount === 'function'){
      this.props.onDidMount.call(this,this.dom)
    }
    
    on(this.searchInput, 'focus', ()=>{this.props.onSearchFocus.call(this,this.state.value)}, passiveEvent);
    on(this.searchInput, 'blur', ()=>{this.props.onSearchBlur.call(this,this.state.value)}, passiveEvent);
    
    if(this.props.enterConfirm){
      on(this.searchInput, 'keyup', (e)=>{
        if (window.event) //如果window.event对象存在，就以此事件对象为准
            e = window.event;
        var code = e.charCode || e.keyCode;
        if (code == 13) { // enter keycode
          this.props.onSearchConfirm.call(this,this.state.value)
          this.hideDropdown()
        }
      }, passiveEvent);
    }
  }
  componentWillUnmount() {
    off(this.searchInput, 'focus', ()=>{this.props.onSearchFocus.call(this,this.state.value)}, passiveEvent);
    off(this.searchInput, 'blur', ()=>{this.props.onSearchBlur.call(this,this.state.value)}, passiveEvent);
  }
  updateDropdown(jsx){
    this.dropdown=jsx;
    this.forceUpdate();
    return this
  }
  showDropdown(){
    this.setState({
      showDropdown:true
    })
    return this
  }
  hideDropdown(){
    this.setState({
      showDropdown:false
    })
    return this
  }
  setValue(value){
    this.setState({
      value:value
    })
    return this
  }
  onSearchChange(){
    var value=this.searchInput.value;
    this.setState({
      value:value
    });
    clearTimeout(this.timer)
    if(value){
      this.timer=setTimeout(this.props.onSearchChange.call(this,value),this.props.delay)
    }else{ //没有值时直接触发不需要延迟
      this.props.onSearchChange.call(this,value)
    }
  }
  render(){
    return (
      <div className={this.props.containerClass}>
        <div className="inputGroup">
          <lable className="inputItem input-search">
            <input type="text" className="form_control" value={this.state.value} placeholder={this.props.placeholder} ref={(input)=>{this.searchInput=input}} onChange={()=>{this.onSearchChange.call(this)}}/>
            <span className="fkp-input-error"></span>
            <span className="fkp-desc">
              <div className="list-container" style={{display:this.state.showDropdown?'block':'none'}}>{this.dropdown}</div>
            </span>
          </lable>
          {this.props.searchBtn&&(
          <lable className="inputItem btn-search">
            <input type="button" className="btn" value={this.props.searchBtnName} ref={(btn)=>{this.searchBtn=btn}} onClick={()=>this.props.onSearchConfirm.call(this,this.state.value)}/>
          </lable>
          )}
        </div>
      </div>
    )
  }
}
SearchForm.defaultProps = {
  searchBtn:true, // has search button
  searchBtnName:'搜索', // text of search button
  placeholder:'搜索关键字', // placeholder of search input
  containerClass:'search-wrap', // component wrapper className
  enterConfirm:true,  // has enter callback with search
  delay:200,          // delay search input callback
  // all function params bind this as component instance
  onSearchFocus:function(value){  //default focus action
    this.searchInput.select()
    this.showDropdown()
  },
  onSearchBlur:function(value){  // default blur action
    this.hideDropdown()
  },
  onSearchChange:function(value){},
  onSearchConfirm:function(value){},
  onDidMount:function(dom){} // dom: component dom
};

export default SearchForm
