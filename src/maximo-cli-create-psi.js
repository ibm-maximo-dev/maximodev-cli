#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var mbo = require('./lib/mbos');

var schema = {
  _version: '0.0.1',
  _description: 'Create a PSI structure for an new installation ',
  properties: {
    package_name: {
      description: "Mbo Name",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain capital letters (i.e MYTABLE)',
      required: true,
      _cli: 'mbo_name',
      default: 'MYTABLE'
    }
    //TODO: Define the prompt.

  }//Ending properties.
};

cli.process(schema, process.argv, create_mbo);

function create_mbo(result) {
  
  var args = Object.assign({}, env.props, result);
  /**
   * Add psi packacdeUI
   */
  mbo.installTemplateMbo("mbos/dbc", env.addonDir(), args);

  /**
   * Add service support on create 
   */

  var service_name = result.service_name;
  log.info("Setting up "+service_name+" service.");

  if(service_name!='ASSET'){
    mbo.installTemplateMbo("mbos/service", env.addonDir(), args);
  }
  
  //Will create the new Mbo service 
  
  
  //Will create the java files
  mbo.installTemplateMbo("mbos/java", env.addonDir(), args);
}

