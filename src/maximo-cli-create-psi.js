#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var mbo = require('./lib/mbos');
const shell = require('shelljs');
var dist = require('./lib/dist');

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
  mbo.installTemplateMbo("psi", env.addonDir(), args);

  /**
   * Copy Files from dist
   * 
   */
   shell.cp('-Rf','./dis/*','./'+schema.package_name+'/FILES')
}

