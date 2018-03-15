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
  shell.exec(`/bin/bash ${gradleFilename} ${tasks}`);
};

gradle.build = function() {
  this.runTasks('build');
};