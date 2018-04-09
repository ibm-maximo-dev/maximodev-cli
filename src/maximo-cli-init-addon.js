#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var productxml = require('./lib/productxml');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');

// https://www.npmjs.com/package/prompt
var path = require('path');
var shell = require('shelljs');

var schema = {
  _version: '0.0.1',
  _description: 'Maximo initialize addon properties',
  properties: {
    addon_prefix: {
      description: "Addon Prefix",
      pattern: /^[a-zA-Z]+$/,
      message: 'Must only contain letters, and should not be no longer than 5 characters',
      required: true,
      _cli: 'addon_prefix',
      _cli_arg_value: '<PREFIX>',
      _prop: 'addon_prefix',
      default: 'BPAAA',
      conform: function(v) {
        if (v.length>5) return false;
        // set default addon name based on the prefix
        schema.properties.addon_id.default = v.toLowerCase()+"_prod1";
        schema.properties.author.default = v.toLowerCase();
        return true;
      }
    },
    addon_id: {
      description: "Addon Name",
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, and underscores',
      required: true,
      _cli: 'addon_name',
      _prop: 'addon_id'
    },
    add_java_support: {
      description: "Add Java support?",
      required: true,
      _cli: 'java_support',
      _yesno: true,
      default: 'n'
    },
    java_package: {
      description: "Default Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'java_package',
      _depends: 'add_java_support',
    },
    author: {
      description: "Addon Author",
      required: false,
      _cli: 'author',
      _prop: 'author',
    },
    addon_description: {
      description: "Addon Description",
      required: false,
      _cli: 'desc',
      _prop: 'addon_description'
    },
    addon_version: {
      description: "Addon Version",
      required: true,
      _cli: 'ver',
      _prop: 'addon_version',
      default: '1.0.0.0'
    },
    maximo_home: {
      description: "Maximo Home",
      required: true,
      _cli: 'maximo_home',
      _prop: 'maximo_home'
    },
    create_productxml: {
      description: "Create product xml file",
      required: true,
      _cli: 'create_productxml',
      _yesno: 'y'
    },
    output_directory: {
      _prompt: false,
      description: "Initialize in the given directory",
      required: true,
      _cli: 'dir',
      default: '.'
    }
  }
};

cli.process(schema, process.argv, init_addon);

function init_addon(result) {
  var baseDir = env.ensureDir(result.output_directory);

  // create properties
  env.initProperties(path.join(baseDir, 'addon.properties'), result);

  // reload env so that we rooted against our new addon directory
  env.reload(path.join(baseDir, 'addon.properties'));

  if (env.bool(result.create_productxml)) {
    log.info("Addon Working Directory is %s", env.addonDir());

    // set our current working directory to be the new addon dir, now.
    shell.cd(env.addonDir());

    log.info("Creating product xml");
    productxml.newProductXml(result, env.productXml());
  }

  log.info("Addon initialized");
}
