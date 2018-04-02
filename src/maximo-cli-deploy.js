#! /usr/bin/env node

const log = require('./lib/logger');
const cli = require('./lib/cli');
const env = require('./lib/env');
const dist = require('./lib/dist');
var fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const schema = {
  _version: '0.0.1',
  _description: 'Deploy the current Maximo artifact',
  properties: {
    dir: {
      description: 'Deploy destination folder',
      _prop: 'maximo_home',
      _cli: 'dir',
    }
  }
}

cli.process(schema, process.argv, deploy);

function deploy(result) {
  const CURR_FOLDER = shell.env['PWD'];

  //check if dist folder exists
  if(!dist.exists(CURR_FOLDER)) {
    log.error(`${dist.BUILD_FOLDER_NAME} folder does not exist. aborting...`);
    return;
  }

  //define dest path
  const SOURCE_FOLDER = path.join(CURR_FOLDER, dist.BUILD_FOLDER_NAME)
  const DEST_FOLDER = path.resolve(result.dir);

  //copy dist to destination
  if (!fs.existsSync(DEST_FOLDER)) {
    log.error("Destination folder does not exist: %s", DEST_FOLDER);
    return;
  }
  log.log(`Deploying ${SOURCE_FOLDER} to ${DEST_FOLDER}`);
  shell.cp('-Rf', `${SOURCE_FOLDER}${path.sep}*`, DEST_FOLDER);
}