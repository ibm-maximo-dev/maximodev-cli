#! /usr/bin/env node

// https://www.npmjs.com/package/commander
var program = require('commander');

console.log('CWD:' + process.cwd());
console.log('dirname:' + __dirname);
console.log('filename:' + __filename);

program
  .version('0.0.1')
  .description('Maximo command line tools')
  .command('init [options]', 'initialize maximo build tools and configuration such as java')
  .command('create [options]', 'create a maximo artifact, such as mbo, add-on, etc').alias('c')
  .command('export [options]', 'export a maximo configuration').alias('x')
  .command('clone [options]', 'clone a maximo application')
  .command('import [options]', 'import a maximo configuration').alias('i')
  .command('build', 'build maximo .zip for current addon').alias('b')
  .command('deploy', 'deploy local maximo artifacts to dev server').alias('d')
  .parse(process.argv);

