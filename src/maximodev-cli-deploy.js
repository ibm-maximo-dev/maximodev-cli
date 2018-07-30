#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



const log = require('./lib/logger');
const cli = require('./lib/cli');
const dist = require('./lib/dist');
var env = require('./lib/env');
var fs = require('fs');
const path = require('path');
const shell = require('shelljs');

var maximo_home = env.maximoHome();

const schema = {
  _version: '0.0.1',
  _description: 'Deploy the current Maximo artifact',
  properties: {
    dir: {
      description: 'Deploy destination folder',
      default: maximo_home,
      _prop: 'maximo_home',
      _cli: 'dir',
      conform: function(v){
        schema.properties.dir.deault = maximo_home;
        return true;
      }
    }
  }
};

cli.process(schema, process.argv, deploy);

function deploy(result) {
  const CURR_FOLDER = shell.env['PWD'];

  //ensure maximo_home for command line process
  if(!result.dir){
    if(!maximo_home){
      maximo_home = shell.env['MAXIMO_HOME'];
    }
    result.dir.deault = maximo_home;
  }

  //check if dist folder exists
  if(!dist.exists(CURR_FOLDER)) {
    log.error(`${dist.BUILD_FOLDER_NAME} folder does not exist. aborting...`);
    return;
  }

  //define dest path
  const SOURCE_FOLDER = path.join(CURR_FOLDER, dist.BUILD_FOLDER_NAME)
  const DEST_FOLDER = path.resolve(result.dir);

  dist.copy(SOURCE_FOLDER, DEST_FOLDER);
}
