#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var program = require('commander');

program
  .version('0.0.1')
  .description('Set Manage configurations')
  .command('server-mode', 'set server mode').alias('sm')
  .command('time-zone', 'set server time zone').alias('tz')
  .command('base-lang', 'set base language').alias('bl')
  .command('secondary-langs', 'set secondary languages').alias('sl')
  .command('build-tag', 'set build tag').alias('bt')
  .parse(process.argv);

// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
