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

var schema = {
  _version: '0.0.1',
  _description: 'Extends an application field class',
  properties: {
    object_name:{
      description: "What's the object name that needs to be extended? (i.e. ASSET)",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain letters, numbers, and underscores in capital letters',
      required: true,
      _cli: 'object_name',
      default: 'ASSET'
    },
    mbo_fqn: {
      description: "What is the Maximo's application name to be extended? (i.e. FQN of application's Mbo: psdi.app.asset.Asset)",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, and dots in lower case',
      required: true,
      _cli: 'ext_id',
      default: 'psdi.app.asset.Asset'
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

  //Create Mbos from extended application
  ext.installTemplateExtMbo("app-extension/mbos", baseDir, args);
  
  //Add extenstions into the product.xml file.
  ext.addMboClassesToProductXML(args);

  log.info("Mbo structure added to the product.xml");
  //END: Process field class extension.
}
