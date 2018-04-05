#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const shell = require('shelljs');
const log = require('./lib/logger');
const gradle = require('./lib/gradle');
const cli = require('./lib/cli');
const dist = require('./lib/dist');
const env = require('./lib/env');
const productxml = require('./lib/productxml');
const presentations = require('./lib/presentations');
const dbcscripts = require('./lib/dbcscripts');

const schema = {
  _version: '0.0.1',
  _description: 'Build the current Maximo artifacts',
  properties: {}
};

cli.process(schema, process.argv, build);

function build(result) {
  const buildDir = shell.env['PWD'];

  // Identify that it is a valid a folder structure created by create addon or create sample-add commands.
  if(!dist.canBuild(buildDir)) {
    log.error(`${buildDir} does not appear to be a valid Maximo home directory, exiting...`);
    return;
  }

  log.log('Building Maximo...');

  // Run task build of any present gradle script.
  log.log('Check if gradle is present');
  if(gradle.exists()) {
    log.log('Gradle Found, building...');
    gradle.build();
  }

  if (env.isValidMaximoHome()) {
    // rebuild the presentation mxs files
    presentations.diffAllForAddon();
  } else {
    log.warn("Skipping to build presentations (if any) because MAXIMO_HOME is not set to a valid Maximo Home directory");
  }

  // Update product.xml when necessary.
  productxml.updateVersion(env.productXmlIn(), env.scriptDir());
  log.info("product xml updated with the latest version");

  // Copy binary files (jar's,class's) to their correct destination folder, configuration files (xml's) any other supporting files.
  log.log();

  log.log(`Creating output folder: ${dist.BUILD_FOLDER_NAME}`);

  dist.build(buildDir);
}
