#! /usr/bin/env node

// https://www.npmjs.com/package/commander
var program = require('commander');

program
  .version('0.0.1')
  .description('Maximo command line tools')
  .command('init [options]', 'initialize maximo build tools and configuration such as java').alias('i')
  .command('set [options]', 'set add on option').alias('s')
  .command('create [options]', 'create a maximo artifact, such as mbo, add-on, etc').alias('cr')
  .command('export [options]', 'export a maximo configuration').alias('exp')
  .command('clone [options]', 'clone a maximo application').alias('cl')
  .command('import [options]', 'import a maximo configuration').alias('imp')
  .command('build', 'build maximo .zip for current addon').alias('b')
  .command('deploy', 'deploy local maximo artifacts to dev server').alias('d')
  .parse(process.argv);

