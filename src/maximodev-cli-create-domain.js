#! /usr/bin/env node

var program = require('commander');
var dm = require('./lib/domains');

program
  .version('0.0.1')
  .description('Create new Maximo domain structure')
  .command('add-structure', 'Create a Synonym Domain').alias('str')
  .command('add-value', 'Add values to a specific domain').alias('val')
  .parse(process.argv);



// check if the user passed a command
if (!program.commands.map(cmd => cmd._name).includes(program.args[0])) {
  console.log("Invalid command: " + program.args[0]);
}
