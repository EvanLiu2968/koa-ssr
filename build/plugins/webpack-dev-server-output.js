const path = require('path');
const fs = require('fs');

let outputPath = null

function DevServerOutput(oPath) {
  outputPath = oPath
}

DevServerOutput.prototype.apply = function(compiler) {

  compiler.plugin("compile", function(params) {
    console.log("The compiler is starting to compile...");
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, '0777');
    }
  });

  compiler.plugin("emit", function(compilation, callback) {
    console.log("The compiler is starting a new compilation...");
    for (let filename in compilation.assets) {

      let fileArr = filename.split(path.sep);
      
      if (fileArr.length > 1) {
        if (!fs.existsSync(path.join(outputPath, fileArr[0]))) {
          fs.mkdirSync(path.join(outputPath, fileArr[0]), '0777');
        }
        fs.writeFileSync(path.join(outputPath, filename), compilation.assets[filename].source());
      }

    }
    callback();
  });

};

module.exports = DevServerOutput;