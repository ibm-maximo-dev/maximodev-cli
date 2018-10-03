#! /usr/bin/env node

var program = require('commander');
var dm = require('./lib/domains');

program
  .version('0.0.1')
  .description('Add domain values')
  .command('synonym', 'Add value to a synonym domain').alias('syn')
  .command('aln', 'Add value to a aln domain').alias('al')
  .command('numeric', 'Add value to a aln domain').alias('num')
  .parse(process.argv);

// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
