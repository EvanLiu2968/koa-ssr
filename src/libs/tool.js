/*
 * sync模块公用方法,node端和broswer端共用代码
 */

//时间转中文更新文字：xx分钟前 xx小时前 xx天前 xx周前 xx月前 xx年前
function timeToLastestCn(timeStamp){
  var date=new Date(timeStamp);
  if(/invalid/i.test(date)){
    return '暂无数据'
  }
  var result = "刚刚发布";
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;

  var diffValue = new Date() - date;
  
  var yearC =diffValue/year;
  var monthC =diffValue/month;
  var halfMonthC =diffValue/(15*day);
  var weekC =diffValue/(7*day);
  var dayC =diffValue/day;
  var hourC =diffValue/hour;
  var minC =diffValue/minute;

  if(yearC>=1){
    result = parseInt(yearC) +"年前";
  } else if(monthC>=1){
    result = parseInt(monthC) +"月前";
  } else if(weekC>=1){
    result = parseInt(weekC) +"周前";
  } else if(dayC>=1){
    result = parseInt(dayC) +"天前";
  } else if(hourC>=1){
    result = parseInt(hourC) +"小时前";
  } else if(minC>=1){
    result = parseInt(minC) +"分钟前";
  }
  return result;
}
//数字转中文
function numberToChinese(num){
  var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"]; //单个数字转换
  var chnUnitSection = ["","万","亿","万亿","亿亿"]; //节权位
  var chnUnitChar = ["","十","百","千"]; //节内权位
  // 节内转换算法
  var sectionToChinese = function(section){
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    while(section > 0){
      var v = section % 10;
      if(v === 0){
        if(!zero){
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      }else{
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }
  // 主转换算法
  var unitPos = 0;
  var strIns = '', chnStr = '';
  var needZero = false;
 
  if(num === 0){
    return chnNumChar[0];
  }
 
  while(num > 0){
    var section = num % 10000;
    if(needZero){
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = sectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }
 
  return chnStr;
}
//中文转数字
function chineseToNumber(chnStr){
  // 中文数字转换
  var chnNumChar = {
    零:0,
    一:1,
    二:2,
    三:3,
    四:4,
    五:5,
    六:6,
    七:7,
    八:8,
    九:9
  };
  // 中文权位转换
  var chnNameValue = {
    十:{value:10, secUnit:false},
    百:{value:100, secUnit:false},
    千:{value:1000, secUnit:false},
    万:{value:10000, secUnit:true},
    亿:{value:100000000, secUnit:true}
  }
  
  var rtn = 0;
  var section = 0;
  var number = 0;
  var secUnit = false;
  var str = chnStr.split('');
 
  for(var i = 0; i < str.length; i++){
    var num = chnNumChar[str[i]];
    if(typeof num !== 'undefined'){
      number = num;
      if(i === str.length - 1){
        section += number;
      }
    }else{
      var unit = chnNameValue[str[i]].value;
      secUnit = chnNameValue[str[i]].secUnit;
      if(secUnit){
        section = (section + number) * unit;
        rtn += section;
        section = 0;
      }else{
        section += (number * unit);
      }
      number = 0;
    }
  }
  return rtn + section;
}
// var testNum1=123;
// var testCn1='九百九十二';
// console.log(testNum1+' => '+numberToChinese(testNum1))
// console.log(testCn1+' => '+chineseToNumber(testCn1))

//textarea文本转换为HTML格式，实力秀简介有用到
function textToHtml(text){
  text=text?text:'';
  var replaceMap = {
    '↵': '<br/>',
    '\r\n': '<br/>',
    '\n': '<br/>',
    '\s': '&nbsp;',
    ' ': '&nbsp;'
  };
  return text.replace(/(↵|\r\n|\n|\s| )/ig, function(all, t) {
    return replaceMap[t];
  });
}

//身份证校验(大陆)
function testChinaID(strID){
  // 1到17位相乘系数
  const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 身份证1到17位分别与系数相乘之和
  var count = coefficient.reduce(function(accumulator,value,i){
    return accumulator+value*parseInt(strID.charAt(i))
  },0)
  // console.log('系数相乘之和:'+count)
  // 和数除以11的余数
  var remainder=count%11
  // console.log('和数除以11的余数:'+remainder)
  // 余数对应身份证第18位的映射表
  var eighteen = {
    0: '1',
    1: '0',
    2: 'x',
    3: '9',
    4: '8',
    5: '7',
    6: '6',
    7: '5',
    8: '4',
    9: '3',
    10:'2',
  }[remainder]
  // console.log('身份证第18位:'+eighteen)
  if(strID.charAt(17) === eighteen){
    return true
  }
  return false
}
// console.log('身份验证结果为:'+testChinaID('53010219200508011x'))

module.exports = {
  timeToLastestCn,
  numberToChinese,
  chineseToNumber,
  textToHtml,
}