#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var dbc = require('./lib/dbcscripts');
var cui = require('./lib/cui');

var next_script = dbc.nextScript();

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new conditional UI',
  properties: {
    option_name: {
      description: "Signature Option's name for the authorization script",
      pattern: /^[A-Z0-9]+$/,
      message: "Enter with the sig option name (i.e. MUST BE in capital letter)",
      required: true,
      _cli: 'option_name',
      conform: function (v) {
        schema.properties.negative_option_name.default = 'N' + v;
        schema.properties.option_name_lower.default = v.toLowerCase();
        return true;
      }
    },
    option_name_lower: {
      _prompt: false,
      pattern: /^[A-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores into UPPER case',
      description: "Script name uppercase",
      required: true,
      _cli: 'option_name_lower',
    },
    negative_option_name: {
      _prompt: false,
      pattern: /^.*\b(python|javascript)\b.*$/,
      message: "Negative Signature Option's name",
      required: true,
      _cli: 'negative_option_name',
    },
    app_name: {
      description: "Application's name",
      pattern: /^[A-Z]+$/,
      message: "The application's name MUST BE in capital letter",
      required: true,
      _cli: 'app_name',
      conform: function (v) {
        schema.properties.app_name_lower.default = v.toLowerCase();
        return true;
      }
    },
    app_name_lower: {
      _prompt: false,
      pattern: /^[A-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores into UPPER case',
      description: "Script name uppercase",
      required: true,
      _cli: 'app_name_lower',
    },
    script_name: {
      description: "DBC Script to insert the condition UI",
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores',
      required: true,
      _cli: 'script_name',
      _cli_arg_value: '<NAME>',
      default: next_script.substring(0, next_script.length - 4)
    },
    script_description: {
      description: "Condition UI purpose's description ",
      pattern: /^[a-zA-Z_0-9 ]+$/,
      message: "Must provide a description about the condition UI's purpose",
      required: true,
      _cli: 'script_description',
    },
  }
};

cli.process(schema, process.argv, create_script);

function create_script(result) {
  //Validate Add on dir. 
  env.validateAddonDir();
  //var scriptDir = path.resolve(env.scriptDir());
  var nextScript = dbc.nextScript();
  log.info(`Creating new dbc scripts ${nextScript} in ${env.scriptDir()}`);
  //populate results into the args value
  var args = Object.assign({}, env.props, result);

  //Specialize the templates into sfv lib. 
  cui.installTemplateCUI("condition-ui", env.addonDir(), args);

}
