#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./lib/logger');
var ext = require('./lib/ext');
var env = require('./lib/env');
var cli = require('./lib/cli');

// https://www.npmjs.com/package/prompt
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');

//Load maximo_home from prop file
var maximo_home = env.get('maximo_home')
if (!maximo_home) {
  maximo_home = ((maximo_home = shell.env['MAXIMO_HOME']) ? maximo_home : '/maximo');
}

//Reading the addon prefix from addon properties file
var addon_prefix = ((addon_prefix = env.get("addon_prefix")) ? addon_prefix : 'PLUSE');

//Reading the addon java package from addon properties file
var java_package = ((java_package = env.get("java_package")) ? java_package : env.javaPackage());

var schema = {
  _version: '0.0.1',
  _description: 'Extends an Maximo application',
  properties: {
    ext_id: {
      description: "What is the Maximo's application name to be extended? (i.e. FQN of application's Mbo: psdi.app.asset.Asset)",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, and underscores in capital letters',
      required: true,
      _cli: 'ext_id',
      default: 'psdi.app.asset.Asset'
    },
    original_app_bean: {
      description: "What is the Maximo's application app bean to be extended? (i.e. FQN of application's AppBean)",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, and underscores in capital letters',
      required: true,
      _cli: 'original_app_bean',
      default: 'psdi.webclient.beans.asset.AssetAppBean'
    },
    ext_prefix: {
      description: "Application's extension prefix",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain letters, and should not be no longer than 5 characters',
      required: true,
      _cli: 'ext_prefix',
      _cli_arg_value: '<PREFIX>',
      _prop: 'addon_prefix',
      default: addon_prefix
    },
    ext_java_package: {
      description: "Default Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'ext_java_package',
      _prop: 'java_package',
      default: java_package
    },
    maximo_home: {
      description: "Maximo Home",
      required: true,
      _cli: 'maximo_home',
      _prop: 'maximo_home',
      default: maximo_home //Maximo home read from the environement 
    },
    add_presetation: {
      description: "Do you want add a presentation structure to your package?",
      required: true,
      _cli: 'add_presetation',
      _yesno: true,
      default: 'y',
    },
    add_mbo: {
      description: "Do you want add a Mbo's structure to your package?",
      required: true,
      _cli: 'add_mbo',
      _yesno: true,
      default: 'y',
    }
  }
};

cli.process(schema, process.argv, create_addon);

function create_addon(result) {
  //Get base directory to work with maximo extensions.
  //Read elements from field class extension
  //TODO replace '.' within env.addonDir()
  var baseDir = path.join(env.addonDir());
  log.info("The application extension will be configured into the %s", baseDir);

  //Ensure the directory creation.
  if (!fs.existsSync(baseDir)) {
    shell.mkdir('-p', baseDir);
  }

  //Creates the extension 
  log.info("Creating application extension in directory %s", baseDir);
  //Check the base dir. 
  fs.ensureDirSync(baseDir);

  //Copied from init add on to check the maximo home environment. 
  if (!result.maximo_home) {
    // backslashes will get interpreted as escapes, so let's using forward slashes... fortunately
    // java, javascript, etc, understand this.
    result.maximo_home = result.maximo_home.replace(/\\/g, '/');
  }
  var args = Object.assign({}, env.props, result);

  //Create the service if necessary
  if (result.add_service) {
    ext.installTemplateExt("app-extension/service", baseDir, args);
  }

  //Create presentation 
  if (result.add_presetation) {
    ext.installTemplateExt("app-extension/presentations", baseDir, args);
  }

  /**
   * If you do add a presention structure you will need to add the Mbo's structure.
   */
  if (result.add_mbo || result.add_presetation) {
    ext.installTemplateExt("app-extension/mbos", baseDir, args);
    ext.addMboClassesToProductXML(args);
  }

  //Showing the 
  log.info("Application Extension Working Directory is %s", baseDir);
  ext.installTemplateExt("app-extension/dbc", baseDir, args);
  log.info("Extension created in %s , Don't forget to implement the required fields into the presentation and Mbo's extensions. This is only a start point!", baseDir);

}
