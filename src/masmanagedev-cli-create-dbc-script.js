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


var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new dbc file',
  properties: {
    dir: {
      required: true,
      description: 'addon script dir',
      default: env.scriptDir(),
      _cli: 'dir',
      conform: function(v) {
        schema.properties.dir.default = env.scriptDir();
        return true;
      }
    },
    scriptname: {
      required: true,
      description: 'script name',
      default: dbcscripts.nextScript(),
      _cli: 'scriptname',
      conform: function(v) {
        schema.properties.scriptname.default = dbcscripts.nextScript();
        return dbcscripts.isValidScriptName(v);
      },
      message: 'Script must be V####_##.ext'
    }
  }
};

cli.process(schema, process.argv, create_dbc_script);

function create_dbc_script(result) {
  dbcscripts.createNewScriptInDir(null, result.scriptname, result.dir)
}
