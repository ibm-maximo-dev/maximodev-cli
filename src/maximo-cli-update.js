#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .description('Update a maximo artifact')
  .command('product-xml', 'update version in product xml').alias('pv')
  .parse(process.argv);

