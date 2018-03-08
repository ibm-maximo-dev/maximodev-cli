"use strict";

const fs = require('fs-extra');
const shell = require('shelljs');
const log = require('./logger');
const path = require('path');

const BUILD_FOLDER_NAME = "dist";

const dist = module.exports = Object.create({});

function canCopy(name, isDir, excludes) {
  for(let i = 0; i < excludes.length;i++) {
    let exclude = excludes[i];
    let result = false;
    if(exclude.type === (isDir?'dir':'file')) {
      if(exclude.is) {
        if(exclude.is === name) return false
      } else if(exclude.endsWith) {
        if(name.endsWith(exclude.endsWith)) return false;
      } else if(exclude.startsWith) {
        if(name.startsWith(exclude.startsWith)) return false;
      };
    };
  }
  return true;
}

dist.parseDir = function(dirPath, excludes) {
  fs.readdir(dirPath).then(files => {
    files.forEach(file => {
      fs.stat(`${dirPath}${path.sep}${file}`).then(fileStat => {
        if(fileStat.isDirectory()) {
          if(canCopy(file, true, excludes)) {
            this.parseDir(`${dirPath}${path.sep}${file}`, excludes);
          } else {
            log.log(`Cant enter ${file}`)
          }
        } else {
          if(canCopy(file, false, excludes)) {
            log.log(`Copying ${dirPath}${path.sep}${file}`);
            let folder = path.join(BUILD_FOLDER_NAME, `${dirPath}${path.sep}${file}`);
            shell.mkdir('-p',folder);
            shell.cp(`${dirPath}${path.sep}${file}`, folder);
          } else {
            log.log(`Cant copy ${file}`)
          }
        }
      }).catch(ex => {
        log.error(ex);
      });;
    });
  }).catch(ex => {
    log.error(ex);
  });
}

dist.build = function() {
  const rootDir = '/Users/jamerson/git-reps/ibm-ghe/maximo-cli';
  const excludes = [
    { 
      type: 'file',
      endsWith: '-rmi-stubs.cmd',
    },
    { 
      type: 'file',
      endsWith: '-rmi-stubs.xml',
    },    
    { 
      type: 'dir',
      is: 'unittest',
    },
    { 
      type: 'dir',
      is: 'virtual',
    },
    { 
      type: 'dir',
      is: 'src',
    },
    { 
      type: 'file',
      endsWith: '.java',
    },
    { 
      type: 'dir',
      startsWith: '.',
    },
    { 
      type: 'dir',
      is: 'node_modules',
    },
    { 
      type: 'file',
      startsWith: '.',
    },
    { 
      type: 'file',
      is: 'copy-resources.xml',
    },
  ];
  this.parseDir(rootDir, excludes)
}