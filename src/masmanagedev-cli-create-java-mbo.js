#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var mbo = require('./lib/mbos');
var dbcscripts = require('./lib/dbcscripts'); 

var nextScript = dbcscripts.nextScript(env.scriptDir(),".dbc"); 

var schema = {
  _version: '0.0.1',
  _description: 'Create a MBO structure for a new Maximo application/customization ',
  properties: {
    mbo_name: {
      description: "Mbo Name",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain capital letters (i.e MYTABLE)',
      required: true,
      _cli: 'mbo_name',
      default: 'MYTABLE'
    },
    java_package: {
      description: "Default Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'java_package',
      _prop: 'java_package'
    },
    mbo_class_name: {
      description: "Mbo class name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must follow Java conventions to define a Java class name (i.e MyTable)',
      required: true,
      _cli: 'mbo_class_name',
      _cli_arg_value: '<ClassName>',
      default: 'MyTable'
    },
    mbo_type:{
      description: "Mbo type (i.g. Choose between standard, stateful and nonpersistent)",
      message: 'Must select between standard and stateful',
      pattern: /^.*\b(standard|stateful|nonpersistent)\b.*$/,
      required: true,
      _cli: 'mbo_type',
      default: 'standard'
    },
    script: {
      required: true,
      description: 'DBC Script',
      _cli: 'script',
      default: nextScript.substr(0,nextScript.indexOf('.')),
      message: 'file does not exist',
      conform: function(v){
        //Ensure script default value in runtime mode. 
        schema.properties.script.default = nextScript.substr(0,nextScript.indexOf('.'));
        return true;
      }
    },
    service_name: {
      description: "What would be the service name?",
      message: 'It must contains capital letters only and should have no more then 18 characters',
      pattern: /^[A-Z]+$/,
      required: true,
      _cli: 'service_name',
      default: 'ASSET',
      conform: function(v) {
        if (v.length>18){ 
          return false;
        }
        return true;
      }
    },
    overwrite: {
      description: "overwrite existing files, if it exists?",
      required: true,
      _cli: 'overwrite',
      _yesno: 'n'
    }
  }//Ending properties.
};

cli.process(schema, process.argv, create_mbo);

function create_mbo(result) {
  
  var args = Object.assign({}, env.props, result);

  //Test again the next script in order to ensure the nextScript from command line without prompt mode.
  try {
    nextScript = dbcscripts.nextScript(env.scriptDir());
    log.info("Next Script: " +nextScript);
  } catch (e) {
    log.info("Error on generate next Script:"+e);
  } // we might not be in an add-on dir, but we can still run scripts
  
  if(!result.script){
    result.default = nextScript.substr(0,nextScript.indexOf('.'));
  }
  
  /**
   * Get Mbo type
   */
  var type = result.mbo_type; 

  /**
   * Add database configuration script.
   */
  mbo.installTemplateMbo("mbos/dbc/"+type, env.addonDir(), args);
  

  /**
   * Add service support on create 
   */

  var service_name = result.service_name;
  log.info("Setting up "+service_name+" service.");

  if(service_name!='ASSET'){
    mbo.installTemplateMbo("mbos/service", env.addonDir(), args);
  }
  

  
  //Will create the java files based on Mbo Type
  mbo.installTemplateMbo("mbos/"+type+"/java", env.addonDir(), args);
}

