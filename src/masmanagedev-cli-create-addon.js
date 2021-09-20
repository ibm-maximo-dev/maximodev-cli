#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var productxml = require('./lib/productxml');
var installers = require('./lib/template_installers');
var log = require('./lib/logger');
var mbos = require('./lib/mbos');
var env = require('./lib/env');
var cli = require('./lib/cli');
var gradle = require('./lib/gradle');

// https://www.npmjs.com/package/prompt
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new addon',
  properties: {
    addon_prefix: {
      description: "Addon Prefix",
      pattern: /^[a-zA-Z]+$/,
      message: 'Must only contain letters, and should not be no longer than 5 characters',
      required: true,
      _cli: 'addon_prefix',
      _cli_arg_value: '<PREFIX>',
      default: 'BPAAA',
      conform: function(v) {
        if (v.length>5) return false;
        // set default addon name based on the prefix
        schema.properties.addon_id.default = v.toLowerCase()+"_prod1";
        schema.properties.author.default = v.toLowerCase();
        schema.properties.java_package.default = v.toLowerCase();
        return true;
      }
    },
    addon_id: {
      description: "Addon Name",
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, and underscores',
      required: true,
      _cli: 'addon_name',
      conform: function(v) {
        schema.properties.java_package.default = v.toLowerCase().replace('_','.');
        return true;
      }
    },
    author: {
      description: "Addon Author",
      required: false,
      _cli: 'author',
    },
    addon_description: {
      description: "Addon Description",
      required: false,
      _cli: 'desc'
    },
    addon_version: {
      description: "Addon Version",
      required: true,
      _cli: 'ver',
      default: '1.0.0.0'
    },
    // add_sample_app: {
    //   description: "Add classic UI sample app?",
    //   required: true,
    //   _cli: 'classic_ui_app',
    //   _yesno: true,
    //   default: 'n'
    // },
    add_java_support: {
      description: "Add Java support?",
      required: true,
      _cli: 'java_support',
      _yesno: true,
      default: 'y'
    },
    java_package: {
      description: "Default Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      default: 'br.ibm.com',
      _cli: 'java_package',
      _depends: 'add_java_support',
    },
    eclipse: {
      description: "Initialize Eclipse projects?",
      required: true,
      _cli: 'eclipse',
      default: 'y',
      _yesno: 'y',
      _depends: 'add_java_support',
    },
    maximo_home: {
      description: "Maximo Home",
      required: true,
      _cli: 'maximo_home',
      _depends: 'add_java_support'
    },
    // add_sample_java_mbo: {
    //   description: "Add sample Java Mbo?",
    //   required: true,
    //   _cli: 'java_mbo',
    //   _yesno: true,
    //   default: 'n',
    //   _depends: 'add_java_support'
    // },
    // add_sample_java_validator: {
    //   description: "Add sample Java Field Validator?",
    //   required: true,
    //   _cli: 'java_field_validator',
    //   _yesno: true,
    //   default: 'n',
    //   _depends: 'add_java_support'
    // },
    // add_sample_autoscript: {
    //   description: "Add sample autoscript field validator?",
    //   required: true,
    //   _cli: 'autoscript',
    //   _yesno: true,
    //   default: 'n'
    // },
    output_directory: {
      description: "Create addon in directory",
      _prompt: false, // you can specify this from the command but we don't prompt for it.
      required: true,
      _cli: 'output_directory',
      default: '.'
    }
  }
};

cli.process(schema, process.argv, create_addon);

function create_addon(result) {
  var baseDir = path.join(result.output_directory, result.addon_id);

  log.info("Creating addon in directory %s", baseDir);
  fs.ensureDirSync(baseDir);

  if (result.maximo_home) {
    // backslashes will get interpreted as escapes, so let's using forward slashes... fortunately
    // java, javascript, etc, understand this.
    result.maximo_home = result.maximo_home.replace(/\\/g,'/');
  }

  // create properites
  env.initProperties(path.join(baseDir, 'addon.properties'), result);

  // reload env so that we rooted against our new addon directory
  env.reload(path.join(baseDir, 'addon.properties'));

  log.info("Addon Working Diretory is %s", env.addonDir());

  // set our current working directory to be the new addon dir, now.
  shell.cd(env.addonDir());

  log.info("Building Maximo directory structure");
  env.ensureAddonDir('applications/maximo/properties/product');

  log.info("Creating product xml");
  productxml.newProductXml(result, env.productXml());

  if (env.bool(result.add_java_support)) {
    env.ensureAddonDir('applications/maximo/businessobjects/src/');
    env.ensureAddonDir('applications/maximo/businessobjects/classes/');

    env.ensureAddonDir('applications/maximo/maximouiweb/src/');
    env.ensureAddonDir('applications/maximo/maximouiweb/webmodule/WEB-INF/classes');

    installers.installJavaSupport(env.addonDir());

    if (env.bool(result.add_sample_java_validator)) {
      result.java_class_name = result.addon_prefix+"FLDSampleFieldValidator";
      mbos.addFieldValidationSample(env.addonBusinessObjectsDir('src'), result);
      productxml.addFieldExtension('ASSET','ASSETNUM','psdi.app.asset.FldAssetnum',result.java_package + "." + result.java_class_name);
    }
  }

  env.ensureAddonDir('resources/presentations');

  log.info("Creating script dir");
  env.ensureDir(env.scriptDir());

  if (env.bool(result.add_java_support) && env.bool(result.eclipse)) {
    log.log("Configuring Eclipse Projects...");
    gradle.runTasks('cleanEclipse eclipse')
    log.log("");
  }

  log.info("Addon created in %s", env.addonDir());
  log.log("cd %s", env.addonDir());
  log.log("explore other masmanagedev-cli commands such as 'create sample-classic-app'");
}
