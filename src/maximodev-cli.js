#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// https://www.npmjs.com/package/commander
var program = require('commander');

var prog = program
  .version('0.0.1')
  .description('Maximo command line tools')
  .command('create [options]', 'create a maximo artifact, such as mbo, add-on, etc').alias('cr')
  .command('build', 'build the current addon').alias('b')
  .command('init [options]', 'initialize maximo add-on environment and java').alias('i')
  .command('update [options]', 'update a maximo artifact such as product xml version').alias('u')
  .command('set [options]', 'set add-on option').alias('s')
  .command('run-dbc [options]', 'run a dbc script file').alias('r')
  .command('deploy', 'publish a build to an artifact server').alias('d');

if (process.env["MAXIMODEV_CLI_BETA"]) {
  prog.command('docker [options]', 'run a commands against Docker images/containers').alias('dk');
}

// .command('deploy', 'deploy local maximo artifacts to a dev server').alias('d')
// .command('package', 'package an add-on for distribution').alias('d')
// .command('export [options]', 'export something from a maximo instance').alias('exp')
// .command('import [options]', 'import something into a maximo instance').alias('imp')
// .command('clone [options]', 'clone a maximo application').alias('cl')
//.command('test', 'run all tests for the add-on').alias('d')

prog.parse(process.argv);


// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
