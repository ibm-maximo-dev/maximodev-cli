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
    if(name.match(exclude.pattern)) {
      log.log(`${name} Ignored: ${exclude.name}`)
      return false;
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
    log.log(`- ${filePath}`);
    const fileStat = fs.statSync(filePath);
    if(fileStat.isDirectory()) {
      if(this.canCopy(file, excludes)) {
        this.parseDir(rootFolder, excludes, path.join(relativePath, file));
      }
    } else {
      if(this.canCopy(file, excludes)) {
        const destFolder = path.join(rootFolder, this.BUILD_FOLDER_NAME, relativePath);
        log.log(`Creating folder ${destFolder}`);
        shell.mkdir('-p',destFolder);
        log.log(`Copying to ${path.join(destFolder, file)}`);
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