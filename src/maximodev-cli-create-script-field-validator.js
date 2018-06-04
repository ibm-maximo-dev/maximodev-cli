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
var templates = require('./lib/templates');

var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');

var next_script = dbc.nextScript();

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new automation script as a mbo field validator',
  properties: {
    file_extension:{
      description: "Script type. Choose between python (py) and JavaScript (js)",
      pattern: /^.*\b(py|js)\b.*$/,
      message: "Please, define the script type for python or javascript (i.g. py or js)",
      required: true,
      default: 'py',
      _cli: 'file_extension',
      conform: function(v){
        if(v==='py'){
          schema.properties.script_language.default = 'python';
        }else{
          schema.properties.script_language.default = 'javascript';
        }        
        return true;
      }
    },
    script_language:{
      _prompt: false,
      pattern: /^.*\b(python|javascript)\b.*$/,
      message: "Script language must be python | javascript",
      required: true,
      _cli: 'script_language',
    },
    launch_point_type:{
      _prompt: false,
      description: "Launch point type",
      pattern: /^[a-zA-Z_0-9]+$/, //Implement the right 
      message: 'There some types of launch points to execute scripts',
      required: true,
      _cli: 'dir',
      default: 'ATTRIBUTE',
    },
    script_description:{
      description: "Automation Script purpose's description ",
      pattern: /^[a-zA-Z_0-9 ]+$/,
      message: "Must provide a description about the automation scrip's purpose",
      required: true,
      _cli: 'script_description',
    },
    object_name:{
      description: "Object's name",
      pattern: /^[A-Z]+$/,
      message: "The object name is alpha uppercase information about the MBO or Table will be target  ",
      required: true,
      _cli: 'object_name',
    },
    attribute_name:{
      description: "Attribute's name",
      pattern: /^[A-Z]+$/,
      message: "The attribute name is alpha uppercase information about the field would be a target for this script",
      required: true,
      _cli: 'attribute_name',
    },
    script_name: {
      description: "Automation Script Name",
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores',
      required: true,
      _cli: 'script_name',
      _cli_arg_value: '<NAME>',
      default: next_script.substring(0,next_script.length -4),
      conform: function(v){
        schema.properties.script_name_upper.default = v.toUpperCase();
        return true;
      }
    },
    script_name_upper: {
      _prompt: false,
      pattern: /^[A-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores into UPPER case',
      description: "Script name uppercase",
      required: true,
      _cli: 'script_name_upper',
    },
  }
};

cli.process(schema, process.argv, create_script);

function create_script(result) {
  env.validateAddonDir();
  var scriptDir = path.resolve(env.scriptDir());
  var nextScript = dbc.nextScript();
  log.info(`Creating new dbc script ${nextScript} in ${env.scriptDir()}`);
  
  //populate results into the args value
  var args = Object.assign({}, env.props, result);

  //Specialize the templates into sfv lib. 
  sfv.installTemplateSFV("script-field-validator", env.addonDir(), args);

}
