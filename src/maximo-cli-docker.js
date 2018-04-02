#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .description('Run a Docker related command')
  .command('deploy', 'deploy a Maximo artifact into a running container').alias('d')
  .parse(process.argv);