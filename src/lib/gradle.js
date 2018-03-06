let fs = require('fs-extra');
var shell = require('shelljs');
let path = require('path');
var log = require('./logger');

let gradle = module.exports = Object.create({});
let isWin = process.platform === "win32";
let gradleFilename = "gradlew";
if (isWin) {
  gradleFilename = gradleFilename.append(".bat");
};

gradle.exists = function(gradlePath) {
  if(!gradlePath) {
    gradlePath = './';
  }
  return fs.existsSync(path.join(gradlePath, gradleFilename));
};

gradle.runTasks = function(tasks) {
  shell.exec(`${gradleFilename} ${tasks}`);
};

gradle.build = function() {
  this.runTasks('build');
};