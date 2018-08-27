'use strict';

module.exports = function(source,map){
  this.cacheable && this.cacheable();
  return '';
  // this.value = source
  // return '/* source */'+JSON.stringify(source)
}

// module.exports = function {
//   var extensions = ['.css', '.less']; //里面定义不需要加载的文件类型
//   for (let i = 0, len = extensions.length; i < len; i++) {
//       require.extensions[extensions[i]] = function () {
//           return false;
//       };
//   }
// }