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

if (!env.isJavaInstalled()) {
  log.error("This addon is not configured for Java support.  You need to install java support first using 'maximo-cli init java'.  MiniApps use a Java DataBean for communicating with Maximo and handling events.");
  process.exit(1);
}

var schema = {
  _version: '0.0.1',
  _description: 'create a new MiniApp for Classic UI',
  properties: {
    miniapp_jsclass_name: {
      description: "JavaScript Class Name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must follow Java conventions to define a Java class name (i.e MyTable)',
      required: true,
      _cli: 'jsclass_name',
      _cli_arg_value: '<ClassName>',
      default: 'MyMiniApp',
      conform: function(v) {
        schema.properties.miniapp_java_class_name.default = v + "Bean";
        schema.properties.miniappid.default = v.toLowerCase();
        return true;
      }
    },
    miniappid: {
      description: "MiniApp Identifier",
      pattern: /^[A-Za-z]+$/,
      message: 'Must only contain letters (i.e myminiapp)',
      required: true,
      _cli: 'id',
      _cli_arg_value: '<ID>',
      default: 'myminiapp',
      conform: function(v) {
        schema.properties.java_package.default = env.javaPackage(v);
        return true;
      }
    },
    java_package: {
      description: "MiniApp Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'java_package',
      _cli_arg_value: '<PACKAGE>'
    },
    miniapp_java_class_name: {
      description: "MiniApp Java Bean Class Name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must follow Java conventions to define a Java class name (i.e MyMiniAppBean)',
      required: true,
      _cli: 'java_class_name',
      _cli_arg_value: '<ClassName>',
      default: 'MyMiniAppBean'
    }
  }
};

cli.process(schema, process.argv, create_app);

function create_app(result) {
  var args = Object.assign({}, env.props, result);

  installer.installTemplateApp("new_miniapp", env.addonDir(), args);
}
