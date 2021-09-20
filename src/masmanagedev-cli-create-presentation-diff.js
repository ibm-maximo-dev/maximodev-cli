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
var presentations = require('./lib/presentations');
var fs = require('fs-extra');
var path = require('path');


var schema = {
  _version: '0.0.1',
  _description: 'Create presentation xml difference file',
  properties: {
    original: {
      required: true,
      description: 'original presentation xml file',
      _cli: 'base',
      message: 'file does not exist',
      conform: function(v) {
        if (fs.existsSync(v)) {
          return true;
        }
        return false;
      }
    },
    modified: {
      required: true,
      description: 'modified presentation xml file',
      _cli: 'modified',
      conform: function(v) {
        return fs.existsSync(v);
      },
      message: 'file does not exist'
    },
    output: {
      required: true,
      description: 'database output script',
      _cli: 'output',
      default: dbcscripts.nextScriptFile(env.scriptDir(), 'mxs'),
      conform: function(v) {
        return !fs.existsSync(v);
      },
      message: 'output file already exists, specify another file'
    }
  }
};

cli.process(schema, process.argv, run_mxsdiff);

function run_mxsdiff(result) {
  log.info("    Base %s", result.original);
  log.info("Modified %s", result.modified);
  log.info("  Output %s", result.output);

  presentations.diff(path.resolve(result.original), path.resolve(result.modified), path.resolve(result.output));
}
