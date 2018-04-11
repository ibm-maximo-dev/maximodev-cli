#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


const cli = require('./lib/cli');
const docker = require('./lib/docker');
const log = require('./lib/logger');
const env = require('./lib/env');
const dist = require('./lib/dist');
const path = require('path');
const shell = require('shelljs');

const schema = {
  _version: '0.0.1',
  _description: 'Extract Maximo deployed on a running container',
  properties: {
    container: {
      required: true,
      description: 'Container name',
      _cli: 'container',
    }
  }
}

cli.process(schema, process.argv, eject);

function eject(result) {
  const CURR_FOLDER = shell.env['PWD'];
  const MAXIMO_FOLDER = 'maximo';
  // check if docker cli is available
  if(!docker.exists()) {
    log.error(`Could not find docker cli, is Docker installed? Aborting...`);
    return;
  }

  // test if container is running
  if(!docker.containerExists(result.container)) {
    log.error(`Could not find container ${result.container}, aborting...`);
    return;
  }

  // eject the code
  log.log(`Extracting Maximo from ${result.container}`);

  let proc = docker.ejectMaximo(result.container, CURR_FOLDER);
  if(proc.code !== 0) {
    log.error(`Could not eject Maximo from ${containerName}: ${proc.stderr}`);
    return;
  }

  //redo java link
  const JAVA_TOOLS_PATH = path.join(CURR_FOLDER, MAXIMO_FOLDER, 'tools', 'java');
  //remove old link (that points to a internal folder of the container)
  shell.rm('-Rf', JAVA_TOOLS_PATH);
  //if JAVA_HOME is defined, create a symlink to it
  if(process.env.JAVA_HOME) {
    shell.ln('-s',process.env.JAVA_HOME, JAVA_TOOLS_PATH);
  }

  //set maximo_home
  if(env.addOnPropsExists()) {
    result.maximo_home=path.join(CURR_FOLDER, MAXIMO_FOLDER);
    env.saveProperties(result, result.global);
  }
}

