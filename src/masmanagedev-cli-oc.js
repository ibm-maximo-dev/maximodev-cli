#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var program = require('commander');

program
  .version('0.0.1')
  .description('Run an operator related command')
  .command('deploy', 'deploy a customization archive into an OpenShift service').alias('d')
  .command('get-config', 'get the current Maximo Manage configurations').alias('c')
  .command('set', 'set Maximo Manage configurations').alias('s')
  .parse(process.argv);

// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
