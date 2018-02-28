#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .description('initialize maximo build tools and configurations')
  .command('addon', 'initialize add-on properties in the current directory').alias('a')
  .command('java', 'install gradle and enable java builds').alias('j')
  .parse(process.argv);
