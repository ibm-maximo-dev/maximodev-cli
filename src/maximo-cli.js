#! /usr/bin/env node

// https://www.npmjs.com/package/commander
var program = require('commander');

program
  .version('0.0.1')
  .description('Maximo command line tools')
  .command('create [options]', 'create a maximo artifact, such as mbo, add-on, etc').alias('cr')
  .command('build', 'build the current addon').alias('b')
  // .command('deploy', 'deploy local maximo artifacts to a dev server').alias('d')
  // .command('package', 'package an add-on for distribution').alias('d')
  .command('init [options]', 'initialize maximo add-on environment and java').alias('i')
  .command('update [options]', 'update a maximo artifact such as product xml version').alias('u')
  // .command('set [options]', 'set add-on option').alias('s')
  // .command('export [options]', 'export something from a maximo instance').alias('exp')
  // .command('import [options]', 'import something into a maximo instance').alias('imp')
  // .command('clone [options]', 'clone a maximo application').alias('cl')
  //.command('publish', 'publish a build to an artifact server').alias('d')
  //.command('test', 'run all tests for the add-on').alias('d')
  .parse(process.argv);

