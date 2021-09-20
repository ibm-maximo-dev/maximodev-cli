#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var dbc = require('./lib/dbcscripts');
var sfv = require('./lib/sfv');
var unittest = require('./lib/unittest');

var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');

//var next_script = dbc.nextScript();

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new classic unit test suite',
  properties: {
    test_description: {
      pattern: /^[a-zA-Z_0-9 ]+$/,
      message: 'Must only contain letters and numbers',
      description: "Description of test purposes",
      message: 'Must only contain letters, numbers, underscores',
      _cli: 'test_description',
      require: true,
    },
    test_name: {
      description: "Unit test class's name",
      pattern: /^[a-zA-Z0-9]+$/gmi,
      message: 'Must follow Java conventions to define a Unit Test class name (i.e MyUnitTest)',
      required: true,
      _cli: 'test_name',
      _cli_arg_value: '<ClassName>',
      default: 'MyUnitTest',
      conform: function (v) {
        schema.properties.test_name_lower.default = v.toLowerCase();
        return true;
      }
    },
    test_name_lower: {
      _prompt: false,
      description: "Unit Test class lower case",
      pattern: /^[a-z0-9]+$/gmi,
      message: "Unit Test class lower cas",
      required: true,
      _cli: 'test_name_lower'
    },
    test_package_dir: {
      description: "FQN for unit test java package",
      pattern: /^[a-zA-Z_0-9.]+$/gmi,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'test_package_dir',
      conform: function(v){
        //For java files puporse only
        schema.properties.test_java_package.default = v;
        return true;
      }
    },
    test_java_package:{
      _prompt: false,
      description: "Java FQN for test classes",
      message: 'Must only contain letters, numbers, underscores, or dots',
      pattern: /^[a-zA-Z_0-9.]+$/gmi,
      require: true,
      _cli: 'test_java_package',
    },
  } //End properties
};

cli.process(schema, process.argv, create_script);

function create_script(result) {
  env.validateAddonDir();
  
  log.info(`Creating new UNIT TEST`);
  //populate results into the args value
  var args = Object.assign({}, env.props, result);

  //Specialize the templates into unittest lib. 
  unittest.installTemplateUTT("unittest/classic", env.addonDir(), args);

}