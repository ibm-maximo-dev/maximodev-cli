/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const fs = require('fs-extra');
const shell = require('shelljs');
const log = require('./logger');
const env = require('./env');
const path = require('path');

const defaultExcludes = [
  {
    name: 'mi-stubs files',
    patterns: [/(rmi-stubs.(xml|cmd))$/],
  },
  {
    name: 'Hidden files',
    patterns: [/^\./],
  },
  {
    name: 'Garbage files',
    patterns: [/^Thumbs.db$/],
  },
  {
    name: 'Template file',
    patterns: [/.\.in$/],
  },
  {
    name: 'Script code stub files',
    patterns: [/([a-z|A-Z|0-9].(py|js))$/],
  },
  {
    name: 'Others',
    patterns: [/^mxdiff$/, /^addon.properties$/],
  },
  {
    name: 'Instalation-related files and folders',
    patterns: [/^rmic-classes.txt$/, /^copy-resources.xml$/, /^installer(Imports)?$/, /^launchpad$/],
  },
  {
    name: 'Unit test folder',
    patterns: [/unittest/],
  },
  {
    name: 'Gradle-related files and folders',
    patterns: [/gradle/],
  },
  {
    name: 'Documentation folder',
    patterns: [/^documents$/],
  },
  {
    name: 'Presentation-related files and folder',
    patterns: [/^BASE.xml$/,/^resources$/],
  },
  {
    name: 'Source folder',
    patterns: [/^src$/],
  },
  {
    name: 'Node.js-related files',
    patterns: [/^node_modules$/],
  },
  {
    name: 'dist files',
    patterns: [/^dist$/],
  }
];


const pathTransformers = [
  {
    /*
     * MiniApps are developed in /webclient/miniapps/ but they need to be built and placed in the
     * /javascript/miniapps/ directory so that the standard maximo build process can package them in the
     * maximouiweb war correctly
     */
    from: '/webclient/miniapps/',
    to: '/webclient/javascript/miniapps/',
    exclude_if: 'MAXIMODEV_CLI_DEVBUILD'
  }
];

const dist = module.exports = Object.create({
  BUILD_FOLDER_NAME: "dist/",
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
        log.info(`${name} ignored: ${exclude.name}`);
        return false;
      }
    }
  }
  return true;
};

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
        const destFolder = path.join(rootFolder, this.BUILD_FOLDER_NAME, this.transformPaths(relativePath));
        shell.mkdir('-p',destFolder);
        shell.cp(filePath, destFolder);
      }
    }
  }
};

dist.canBuild = function(buildDir) {
  if(fs.existsSync(path.join(buildDir,'applications'))) {
    return true;
  }
  return false;
};

dist.exists = function(rootDir) {
  const destFolder = path.join(rootDir, this.BUILD_FOLDER_NAME);
  return fs.existsSync(destFolder);
}

dist.build = function(rootDir, userExcludes) {

  const excludes = userExcludes || defaultExcludes;

  // Clean build folder (output)
  log.log(`Building ${rootDir}`);
  const destFolder = path.join(rootDir, this.BUILD_FOLDER_NAME);
  if(!fs.existsSync(destFolder)) {
    shell.mkdir('-p',destFolder);
  }
  shell.rm('-Rf',`${destFolder}${path.sep}*`);

  this.parseDir(rootDir, excludes);
};

dist.transformPaths = function(fullPath) {
  for (var trans of pathTransformers) {
    // skip any transforms that should be skipped in a dev build
    if (trans.exclude_if && env.get(trans.exclude_if, false)) continue;
    fullPath = transformPath(fullPath, trans.from, trans.to);
  }
  return fullPath;
};

dist.copy = function(sourceDir, destDir) {

  //copy dist to destination
  if (!fs.existsSync(destDir)) {
    log.error("Destination folder does not exist: %s", destDir);
    return;
  }
  log.log(`Deploying ${sourceDir} to ${destDir}`);
  shell.cp('-Rf', `${sourceDir}${path.sep}*`, destDir);
  log.log(`Deployed to ${destDir}`);
}


function transformPath(fullPath, match, replace) {
  if (fullPath.indexOf(match)>-1) {
    let parts = fullPath.split(match);
    if (parts && parts.length===2) {
      fullPath = path.join(parts[0], replace, parts[1]);
    }
  }
  return fullPath;
}

