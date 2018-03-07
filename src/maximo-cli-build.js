#! /usr/bin/env node

const fs = require('fs-extra');
const shell = require('shelljs');
const path = require('path');
const program = require('commander');
const log = require('./lib/logger');
const gradle = require('./lib/gradle');
const cli = require('./lib/cli');

const BUILD_FOLDER_NAME = "dist";

const schema = {
  _version: '0.0.1',
  _description: 'Build the current Maximo artifact',
  properties: {}
}

cli.process(schema, process.argv, build);

function build(result) {
  log.log('Building Maximo...');

  // Read the current directory.

  // Identify that it is a valid a folder structure created by create addon or create sample-add commands.

  // Run task build of any present gradle script.
  log.log('Check if gradle is present');
  if(gradle.exists()) {
    log.log('Gradle Found');
    gradle.build();
  }

  // Clean build folder (output)
  if(!fs.existsSync(BUILD_FOLDER_NAME)) {
    fs.mkdirSync(BUILD_FOLDER_NAME);
  }
  shell.rm('-Rf',`./${BUILD_FOLDER_NAME}/*`);

  // Copy binary files (jar's,class's) to their correct destination folder, configuration files (xml's) any other supporting files.
  log.log();
  log.log('Created files:');
  shell.find(['applications']).filter((file) => {
    return file.match(/\.class$/) || file.match(/\.jar$/);
  }).forEach((classFile) => {
    let classFileInfo = path.parse(classFile);
    let folder = path.join(BUILD_FOLDER_NAME, classFileInfo.dir);
    shell.mkdir('-p',folder);
    log.log(path.join(folder,classFileInfo.base))
    shell.cp(classFile, folder)
  });

  // Update product.xml when necessary.

}

