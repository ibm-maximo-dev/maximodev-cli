/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const shell = require('shelljs');
const path = require('path');
const log = require('./logger');

const gradle = module.exports = Object.create({});

const IS_WIN = process.platform === "win32";

let gradleFilename = "gradlew";
if (IS_WIN) {
  gradleFilename = gradleFilename.append(".bat");
};

gradle.exists = function(gradlePath) {
  if(!gradlePath) {
    gradlePath = './';
  }
  return fs.existsSync(path.join(gradlePath, gradleFilename));
};

gradle.runTasks = function(tasks) {
  if (shell.exec(`/bin/bash ${gradleFilename} ${tasks}`).code !== 0) {
    process.exit(1);
  }
};

gradle.build = function() {
  this.runTasks('build');
};