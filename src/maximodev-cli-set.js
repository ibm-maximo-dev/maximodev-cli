#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var program = require('commander');

program
  .version('0.0.1')
  .description('set addon property')
  .command('maximo-home', 'set the maximo home directory that contains the full maximo build').alias('m')
  //.command('java-home', 'set the java home to use run running java commands').alias('j')
  //.command('property', 'set a property in the addon.properties').alias('p')
  .parse(process.argv);

// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
