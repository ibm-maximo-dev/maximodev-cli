#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var program = require('commander');

program
  .version('0.0.1')
  .description('Update a maximo artifact')
  .command('product-xml', 'update version in product xml').alias('pv')
  .parse(process.argv);

