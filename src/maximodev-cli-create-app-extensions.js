#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var program = require('commander');

program
  .version('0.0.1')
  .description('Create extensions for Maximo\'s object strucutre (i.e. Mbo,Field Classes,Applications)')
  .command('app', 'Extends an application structure').alias('application')
  .command('field', 'Extends a field class').alias('fld')
  .command('mbo', 'Extends a Mbo structure').alias('mb')
  .command('service', 'Extends a application\'s service structure').alias('svc')
  .parse(process.argv);

// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
