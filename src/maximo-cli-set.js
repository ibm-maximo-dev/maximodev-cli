#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .description('set addon property')
  .command('maximo-home', 'set the maximo home directory that contains the full maximo build').alias('m')
  .command('java-home', 'set the java home to use run running java commands').alias('j')
  //.command('property', 'set a property in the addon.properties').alias('p')
  .parse(process.argv);

