#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var psi = require('./lib/psi');
const fs = require('fs');
var dist = require('./lib/dist');

var schema = {
  _version: '0.0.1',
  _description: 'Create a PSI structure for an new installation ',
  properties: {
     package_name: {
      description: "Package Name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must only contain letters and numbers (i.e hotfix7960)',
      required: true,
      _cli: 'package_name',
      default: 'default'
    }
    //TODO: Define the prompt.

  }//Ending properties.
};

cli.process(schema, process.argv, create_package);

function create_package(result) {
  
  var args = Object.assign({}, env.props, result);
  /**
   * Add psi packacdeUI
   */
  psi.installTemplatePSI("psi", env.addonDir(), args);

  /**
   * Copy Files from dist
   */
  psi.copyFolderRecursiveSync('/dist', '/installer/'+result.package_name+'Package/FILES/');
   
}

