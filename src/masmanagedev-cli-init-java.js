#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var cli = require('./lib/cli');
var templates = require('./lib/template_installers');

var schema = {
  _version: '0.0.1',
  _description: 'Maximo initialize java support',
  properties: {
    dir: {
      required: true,
      description: 'base directory for project',
      default: '.',
      _cli: 'dir'
    }
  }
};

cli.process(schema, process.argv, initialize_java);

function initialize_java(result) {
  templates.installJavaSupport(result.dir);
}
