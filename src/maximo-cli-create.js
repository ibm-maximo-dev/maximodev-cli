#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .description('Maximo create artifact')
  .command('dbc-script', 'create an empty dbc in the product directory').alias('dbc')
  .command('productxml', 'create product xml file in products directory').alias('prod')
  .command('app', 'create a maximo application').alias('a')
  .command('addon', 'create a maximo add-on').alias('product')
  .command('java-field-validator', 'create Java field validation class').alias('jfv')
  .command('script-field-validator', 'create Script field validation').alias('sfv')
  .parse(process.argv);

