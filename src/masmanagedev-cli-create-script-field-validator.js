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
var sfv = require('./lib/sfv');

var next_script = dbc.nextScript(env.scriptDir(),"dbc");

next_script = next_script.substring(0, next_script.length - 4)

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new automation script as a mbo field validator',
  properties: {
    script_language: {
      description: "Script type. Choose between python (py) and JavaScript (js)",
      pattern: /^.*\b(python|javascript)\b.*$/,
      message: "Script language must be python | javascript",
      default: "python",
      required: true,
      _cli: 'script_language',
    },
    launch_point_type: {
      _prompt: false,
      description: "Launch point type",
      pattern: /^[a-zA-Z_0-9]+$/, //Implement the right 
      message: 'There some types of launch points to execute scripts',
      required: true,
      _cli: 'launch_point_type',
      default: 'ATTRIBUTE',
    },
    script_description: {
      description: "Automation Script purpose's description ",
      pattern: /^[a-zA-Z_0-9 ]+$/,
      message: "Must provide a description about the automation scrip's purpose",
      required: true,
      default: "Brief comment about the automation script",
      _cli: 'script_description',
    },
    object_name: {
      description: "Object's name",
      pattern: /^[A-Z]+$/,
      message: "The object name is alpha uppercase information about the MBO or Table will be target  ",
      default: "ASSET",
      required: true,
      _cli: 'object_name',
    },
    attribute_name: {
      description: "Attribute's name",
      pattern: /^[A-Z]+$/,
      message: "The attribute name is alpha uppercase information about the field would be a target for this script",
      required: true,
      default: "ASSETNUM",
      _cli: 'attribute_name',
    },
    automation_script_name:{
      description: "Automation Script name",
      pattern: /^[A-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, underscores and should be in capital letter',
      default: "MYAUTOMATIONSCRIPT",
      required: true,
      _cli: 'automation_script_name'
    },
    script_name: {
      description: "DBC Script to insert",
      pattern: /^[A-Z_0-9]+$/,
      message: 'Must only contain letters, numbers in capitall letter',
      required: true,
      _cli: 'script_name',
      default: next_script
    },
  }
};

cli.process(schema, process.argv, create_script);

function create_script(result) {

  env.validateAddonDir();
  var nextScript = dbc.nextScript();

  log.info(`Creating new dbc stub scripts ${nextScript} in ${env.scriptDir()}`);
  //populate results into the args value
  var args = Object.assign({}, env.props, result);

  //Specialize the templates into sfv lib. 
  sfv.installTemplateSFV("script-field-validator", env.addonDir(), args);

}
