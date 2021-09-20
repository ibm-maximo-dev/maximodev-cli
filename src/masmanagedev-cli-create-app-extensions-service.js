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
  _description: 'Extends an application RMI Service (i.e. ASSET)',
  properties: {
    service_name: {
      description: "What is the original Service Name?",
      pattern: /^[a-zA-Z_0-9.]+$/,
      require: true,
      _cli: 'service_name',
      default: 'ASSET'
    },
    service_fqn: {
      description: "What is the original Service's name FQN?",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, and dots in lower case',
      required: true,
      _cli: 'service_fqn',
      default: 'psdi.app.asset.AssetService'
    },
    add_remote_service: {
      description: "Do you want to extends the remote service?",
      required: true,
      _cli: 'add_remote_service',
      _yesno: true,
      default: 'n',
    },
    remote_service_fqn: {
      description: "What is the original Remote Service's name FQN?",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, and dots in lower case',
      required: true,
      _cli: 'remote_service_fqn',
      _depends: 'add_remote_service',
      default: 'psdi.server.MaxVarServiceRemote'
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
  ext.installTemplateExtService("app-extension/service/standalone", baseDir, args);

  //Copy remote service structure
  if(args.add_remote_service){
    ext.installTemplateExtService("app-extension/service/remote", baseDir, args);
  }
  
  //Add extenstions into the product.xml file.
  ext.addServiceClassesToProductXML(args);

  log.info("Field class added to the product.xml");
  //END: Process field class extension.
}
