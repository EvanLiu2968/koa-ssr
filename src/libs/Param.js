/*
 * 搜索参数 => 增、删、改、查、格式化
 */

const valueSeparator = ',', searchMode = 'async';

/**
 * 将当前search字符串结合新加map参数拼接成新的search字符串
 * 
 * @param {String} search 
 * @param {JSON} map 
 * @returns {String}
 */
function concatSearch(search,map){
  var searchMap=formatSearch(search);
  for(let key in map){
    if(searchMap[key]&&searchMap[key].split(valueSeparator).some((v)=>v==map[key])) continue;//重复参数忽略
    if(searchMap[key]){
      let arr=searchMap[key].split(valueSeparator);
      arr.push(map[key])
      searchMap[key]=arr.join(valueSeparator)
    }else{
      searchMap[key]=map[key]+'' // 防止提交数字格式
    }
  }
  return joinSearch(searchMap)
}
/**
 * format location.search as searchMap
 * 
 * @param {String} search 
 * @returns {JSON}
 */
function formatSearch(search){
  var searchMap = {};
  if(!search){ return searchMap }
  searchMap=search.replace(/^\?/,'').split('&').reduce(function(acc,v,i,a){
    let key=v.split('=')[0],value=v.split('=')[1];
    if(acc[key]){
      let arr=acc[key].split(valueSeparator)
      arr.push(value)
      acc[key]=arr.join(valueSeparator)
    }else{
      acc[key]=value+'' // 防止提交数字格式
    }
    return acc
  },{})
  return searchMap
}
function joinSearch(searchMap){
  var search=[];
  for(let key in searchMap){
    searchMap[key].split(valueSeparator).forEach((v)=>{
      if(v){
        search.push(key+'='+v)
      }
    })
  }
  if(search.length>0){
    return '?'+search.join('&')
  }else{
    return ''
  }
}
/**
 * 将config的参数设置为serialize的参数，原参数抛弃
 * 
 * @param {String} search 
 * @param {JSON} map 
 * @returns {String}
 */
function setSearchParam(search,map){
  var searchMap=formatSearch(search);
  for(let key in map){
    if(map[key]===0 || map[key]==='0' || map[key]){ //0 '0'是允许格式参数(价格范围:0~50)
      searchMap[key]=map[key]+'' // 防止提交数字格式
    }else{
      searchMap[key]=''
    }
  }
  return joinSearch(searchMap)
}
/**
 * 将key值的参数全部删除（例如不限功能
 * @param {String} search 
 * @param {String || Array} key 
 * @returns {JSON}
 */
function removeSearchParam(search,key){
  var searchMap=formatSearch(search);
  if(typeof key == 'string'){
    delete searchMap[key]
  }else if(Array.isArray(key)){
    key.forEach(function(v){
      delete searchMap[v]
    })
  }else{
    console.error('key is required String or Array')
  }
  return joinSearch(searchMap)
}
/**
 * 从search获取key的value
 * 
 * @param {String} search 
 * @param {String} key 
 * @returns {String} value
 */
function getSearchParam(search,key){
  var searchMap=formatSearch(search);
  if(searchMap[key]){
    return searchMap[key]
  }else{
    return ''
  }
}

/**
 * format location.pathname as params
 * 
 * @param {Number} level (default as 1)
 * @returns 
 */
function formatPath(level){
  level=level?parseInt(level):1;//基路由级数，默认为一级目录
  if(typeof window === 'undefined'){
    return false
  }
  var paramArr=window.location.pathname.split('/');
  return {
    // name:paramArr[level],
    cat:paramArr[level+1],
    title:paramArr[level+2],
    id:paramArr[level+3],
    dest:paramArr[level+4]
  }
}
/**
 * 封装window.history.pushState
 * 
 * @param {String} url:window.location.href
 */
function pushState(url){
  if(searchMode === 'async'){
    window.history.pushState({action:'research'},'title',url)
    //触发自定义pushState事件
    const e = new CustomEvent("pushState");
    window.dispatchEvent(e);
  }else{
    window.location.href=url
  }
}

/**
 * 是否是客户端
 * 
 * @returns {Boolean}
 */
function isClient(){
  return typeof window !== 'undefined'
}

/**
 * 是否是node端
 * 
 * @returns {Boolean}
 */
function isNode(){
  return typeof module !== "undefined" && typeof module.exports !== "undefined"
}

module.exports = {
  formatSearch,
  concatSearch,
  joinSearch,
  setSearchParam,
  removeSearchParam,
  getSearchParam,

  formatPath,
  pushState,
}