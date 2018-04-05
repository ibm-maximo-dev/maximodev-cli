#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var program = require('commander');

program
  .version('0.0.1')
  .description('Run a Docker related command')
  .command('deploy', 'deploy a Maximo artifact into a running container').alias('d')
  .parse(process.argv);