#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var dbcscripts = require('./lib/dbcscripts');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var installer = require("./lib/template_installers");


var schema = {
  _version: '0.0.1',
  _description: 'create a new classic ui sample app',
  properties: {
    add_sample: {
      description: "Add classic UI sample app?",
      required: true,
      _cli: 'add_sample',
      _yesno: 'y',
    }
  }
};

cli.process(schema, process.argv, create_app);

function create_app(result) {
  if (!env.bool(result.add_sample)) {
    log.info("Sample not added");
    process.exit(0);
  }

  var args = Object.assign({}, env.props, result);
  if (!args.java_package) {
    log.error("This addon is not configured for Java support.  You need to install java support first using 'maximo-cli init java'");
    process.exit(1);
  }
  installer.installTemplateApp("newsampleclassicapp", env.addonDir(), args);
  //process.exit(0);
}
