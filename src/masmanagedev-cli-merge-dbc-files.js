#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var cli = require('./lib/cli');
var env = require('./lib/env');
var dbc = require('./lib/dbcscripts');

dbc.listBuildScripts('dbc');


var schema = {
  _version: '0.0.1',
  _description: 'Define the script start point',
  properties: {
    script_base: {
      required: true,
      description: 'Base script to me merged',
      default: '.',
      _cli: 'script_base',
      message: 'Not valid script name',
    }
  }
};

cli.process(schema, process.argv, function (results) {
  
  console.log ("Starting merge script");
  var script_base = results.script_base; 

  dbc.mergeScript(script_base);
  console.log ("All scripts were merged into "+ script_base);

});
