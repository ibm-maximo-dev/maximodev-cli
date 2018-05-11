#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
  .command('classic-miniapp', 'Creates a MiniApp for use in the Classic UI').alias('miniapp')
  .command('psi', 'create a new process solution install - PSI ').alias('si')
  .command('java-mbo', 'create a java MBO (Maximo Business Object) structure for Maximo development ').alias('mbo')
  //.command('sample-nextgenui-app', 'create a sample maximo nextgenui application').alias('snga')
  .parse(process.argv);

