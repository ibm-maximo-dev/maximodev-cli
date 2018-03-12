"use strict";

const fs = require('fs-extra');
const shell = require('shelljs');
const log = require('./logger');
const path = require('path');

const dist = module.exports = Object.create({
  BUILD_FOLDER_NAME: "dist",
});

dist.canCopy = function(name, excludes) {
  //cant copy de build folder that is been built now
  if(name === this.BUILD_FOLDER_NAME) {
    return false
  }
  for(let i = 0; i < excludes.length;i++) {
    let exclude = excludes[i];
    for(let j = 0; j < exclude.patterns.length;j++) {
      const pattern = exclude.patterns[j];
      if(name.match(pattern)) {
        log.info(`${name} Ignored: ${exclude.name}`)
        return false;
      }
    }
  }
  return true;
}

dist.parseDir = function(rootFolder, excludes, relativePath = ".") {
  const currentFolder = path.join(rootFolder, relativePath);
  const files = fs.readdirSync(currentFolder);
  for(let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(currentFolder, file);
    const fileStat = fs.statSync(filePath);
    if(fileStat.isDirectory()) {
      if(this.canCopy(file, excludes)) {
        this.parseDir(rootFolder, excludes, path.join(relativePath, file));
      }
    } else {
      if(this.canCopy(file, excludes)) {
        const destFolder = path.join(rootFolder, this.BUILD_FOLDER_NAME, relativePath);
        shell.mkdir('-p',destFolder);
        shell.cp(filePath, destFolder);
      }
    }
  }
}

dist.build = function(rootDir, excludes) {
  // Clean build folder (output)
  log.log(`Building ${rootDir}`);
  const destFolder = path.join(rootDir, this.BUILD_FOLDER_NAME);
  if(!fs.existsSync(destFolder)) {
    shell.mkdir('-p',destFolder);
  }
  shell.rm('-Rf',`./${destFolder}/*`);

  this.parseDir(rootDir, excludes);
}