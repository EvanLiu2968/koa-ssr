/*
 * 通过document.domain和iframe实现跨子域通信(互通localStorage,sessionStorage不考虑了)
 * document.domain已经在public/js/fkp/sax里统一设置
 * 关键点：使用iframe加载回调无法达到localStorage.getItem(key)同步return的模式，将陷入无穷回调，解决方案如下：
 * 第一步：执行时就直接加载iframe,但会存在一个加载时间差，期间用window.localStorage来代替
 * 第二步：copy iframe.contentWindow.localStorage至window.localStorage，setItem/removeItem同步更新
 */
const isClient = typeof window !== 'undefined'

function appendIframe(iframeId, iframeSrc, callback){
  var iframe=document.getElementById(iframeId)
  if(iframe && iframe.contentWindow){
    callback(iframe.contentWindow)
    return
  }
  iframe = document.createElement("iframe");
  iframe.src = iframeSrc
  iframe.id = iframeId;
  iframe.style.display = "none";
  if (iframe.attachEvent) {
    iframe.attachEvent("onload", function(){
      callback(iframe.contentWindow)
    });
  }else {
    iframe.onload = function(){
      callback(iframe.contentWindow)
    };
  }
  document.body.appendChild(iframe);
}

function isUrl(value) {
  return /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i.test(value)
}

/*
 * 第一步
 */
var corsWindow = null
if(isClient){
  const iframeSrc=isUrl(window.CONFIG.SITE.www) ? window.CONFIG.SITE.www : 'http://www.baidu.com/'; //方便本地测试
  if(window.location.href.indexOf(iframeSrc)>-1){
    // corsWindow = window
  }else{
    appendIframe('domain-iframe',iframeSrc,function(iframeWindow){
      try{
        copyStorageFromIframe(iframeWindow)
        corsWindow = iframeWindow
      }catch(e){
        console.log(e)
      }
    })
  }
}

/*
 * 第二步
 */
const whiteList = ['translang', 'search_history']
function copyStorageFromIframe(iframeWindow){
  whiteList.forEach(function(key){
    var value=iframeWindow.localStorage.getItem(key)
    if(value){
      window.localStorage.setItem(key,value)
    }else{
      window.localStorage.removeItem(key)
    }
  })
}

//Cross-Origin Resource Sharing Storage, keeping the same usage with localStorage.
const corsStorage = {
  getItem:function(key){
    if(corsWindow && corsWindow.localStorage){
      return corsWindow.localStorage.getItem(key)
    }else{
      return window.localStorage.getItem(key)
    }
  },
  setItem:function(key,value){
    if(corsWindow && corsWindow.localStorage){
      corsWindow.localStorage.setItem(key,value)
    }
    window.localStorage.setItem(key,value)
  },
  removeItem:function(key){
    if(corsWindow && corsWindow.localStorage){
      corsWindow.localStorage.removeItem(key)
    }
    window.localStorage.removeItem(key)
  }
}

module.exports = corsStorage