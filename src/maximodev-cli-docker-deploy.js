#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


const cli = require('./lib/cli');
const docker = require('./lib/docker');
const log = require('./lib/logger');
const dist = require('./lib/dist');
const path = require('path');
const shell = require('shelljs');

const schema = {
  _version: '0.0.1',
  _description: 'Deploy the current Maximo artifact into a running container',
  properties: {
    container: {
      required: true,
      description: 'Container name',
      _cli: 'container',
    }
  }
}

cli.process(schema, process.argv, deploy);

function deploy(result) {
  const CURR_FOLDER = process.cwd();
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

  // deploy the code
  const SOURCE_FOLDER = path.join(CURR_FOLDER, dist.BUILD_FOLDER_NAME)
  log.log(`Deploying ${SOURCE_FOLDER} to ${result.container}`);
  docker.deploy(result.container, SOURCE_FOLDER);
}

