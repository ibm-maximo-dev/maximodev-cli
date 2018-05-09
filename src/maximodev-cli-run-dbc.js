#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var dbcscripts = require('./lib/dbcscripts');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var fs = require('fs-extra');
var path = require('path');


var lastScript = null;

try {
  lastScript = dbcscripts.lastScript();
} catch (e) {} // we might not be in an add-on dir, but we can still run scripts

var schema = {
  _version: '0.0.1',
  _description: 'Run a Maximo DBC Script File',
  properties: {
    script: {
      required: true,
      description: 'DBC Script',
      _cli: 'script',
      default: lastScript,
      message: 'file does not exist'
    }
  }
};

cli.process(schema, process.argv, run_cmd);

function run_cmd(result) {
  log.info("    Script %s", result.script);

  dbcscripts.runScript(result.script);
}
