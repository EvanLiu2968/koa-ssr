const fs = require('fs');
// https://github.com/jonschlinkert/remarkable
const Remarkable = require('remarkable');
const hljs = require('highlight.js');

const markdown = new Remarkable({
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     true,        // Use '/' to close single tags (<br />)
  breaks:       true,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      true,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(lang, str).value;
        } catch (err) {
          console.log(err)
        }
    }
    try {
        return hljs.highlightAuto(str).value;
    } catch (err) {
      console.log(err)
    }
    return str; // use external default escaping
  }
})

// 配合 await同步读取文件
function readFileSync(dir){
  return new Promise((resolve,reject)=>{
    fs.readFile(dir,'utf-8',(err,data)=>{
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}
// 运行shell
function runCmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var res = "";

  child.stdout.on('data', function(buffer) { res += buffer.toString(); });
  child.stdout.on('end', function() { callback (res) });
}

module.exports = {
  markdown,
  readFileSync,
  runCmd
}