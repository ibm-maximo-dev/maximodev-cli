#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .description('Create a maximo artifact')
  .command('addon', 'create a maximo add-on').alias('product')
  .command('dbc-script', 'create an empty dbc in the product\'s script directory').alias('dbc')
  .command('product-xml', 'create product xml file in products directory').alias('prod')
  .command('presentation-diff', 'compare two presentation xml files and create a diff dbc script').alias('pd')
  .command('java-field-validator', 'create Java field validation class').alias('jfv')
  //.command('script-field-validator', 'create Script field validation').alias('sfv')
  .command('sample-classic-app', 'create a sample maximo classic application').alias('sca')
  //.command('sample-nextgenui-app', 'create a sample maximo nextgenui application').alias('snga')
  .parse(process.argv);

