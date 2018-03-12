#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var dbc = require('./lib/dbcscripts');
var templates = require('./lib/templates');

var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new automation script as a mbo field validator',
  properties: {
    script_name: {
      description: "Automation Script Name",
      pattern: /^[a-zA-Z_0-9 ]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores',
      required: true,
      _cli: 'script_name',
      _cli_arg_value: '<NAME>',
      default: 'TEST_SCRIPT'
    },
  }
};

cli.process(schema, process.argv, create_script);

function create_script(result) {
  env.validateAddonDir();
  var scriptDir = path.resolve(env.scriptDir());
  var nextScript = dbc.nextScript();
  log.info(`Creating new dbc script ${nextScript} in ${env.scriptDir()}`);
  //templates.renderToFile()
}
