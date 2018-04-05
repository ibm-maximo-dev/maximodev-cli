/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const shell = require('shelljs');
const log = require('./logger');
const path = require('path');
const fs = require('fs-extra');
const docker = module.exports = Object.create({});

docker.exists = () => {
  let dockerProcess = shell.exec('docker version',{silent:true})
  
  //the command must have exit code === 0
  return (dockerProcess?dockerProcess.code:-1) === 0;
}

docker.deploy = (containerName, distFolder) => {
  let proc = docker.cp(containerName, distFolder);
  if(proc.code !== 0) {
    log.error(`Could not copy ${distFolder} to ${containerName}`);
    return;
  }

  shell.exec(`docker exec ${containerName} /deploydist.sh`);
}

docker.containerExists = (name) => {
  let containers = docker.listContainers();
  if(!(containers.indexOf(name) >= 0)) {
    log.error(`Could not find the specified container ${name}`);
    if(containers.length > 0) {
      log.error(`Current running containers: ${containers.join(', ')}`);
    }
    return false;
  }

  return true;
}

docker.listContainers = () => {
  let result = [];
  const CMD = 'docker ps --format {{.Names}}';

  // parse the list of containers (result of ps) and converts it to an array, removing any empty lines that split could create in the process
  return shell.exec(CMD, {silent:true}).stdout.split('\n').filter(item => { return item.trim().length > 0});
}

docker.cp = (name, source) => {
  const PARSED_FOLDER = path.parse(source); 
  const CMD = `docker cp ${source} ${name}:/`;
  return shell.exec(CMD, {silent:true});
}