#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./lib/logger');
var ext = require('./lib/ext');
var cli = require('./lib/cli');
var env = require('./lib/env');

var path = require('path');

//Reading the addon java package from addon properties file
var java_package = ((java_package = env.get("java_package")) ? java_package : 'ibm.com.maximo');

var schema = {
  _version: '0.0.1',
  _description: 'Extends an application field class',
  properties: {
    ext_mbo: {
      description: "Enter the target Mbo",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain letters, numbers, and underscores in capital letters',
      required: true,
      _cli: 'ext_mbo',
      default: 'ASSSET'
    },
    ext_field: {
      description: "What is the target attribute name to be extended (i.e. ASSETNUM)",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain letters, numbers, and underscores in capital letters',
      required: true,
      _cli: 'ext_field',
      default: 'ASSETNUM'
    },
    ext_fqn_field: {
      description: "Provide the FQN (Full Qualified Name) for the original field class",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Please insert the FQN for the field class',
      required: true,
      _cli: 'ext_fqn_field',
      default: java_package+'.FldWonumExample'
    },
  }
};

cli.process(schema, process.argv, create_addon);

function create_addon(result) {
  //START: Process field class extension.
  //get the addon directory
  var baseDir = path.join(env.addonDir());

  //Add the field class to the product.xml file 
  var args = Object.assign({}, env.props, result);

  ext.addFieldClassesToProductXML(args);

  //Copy template file 
  ext.installTemplateExtField("app-extension/field", baseDir, args);

  log.info("Field class added to the product.xml");
  //END: Process field class extension.
}
