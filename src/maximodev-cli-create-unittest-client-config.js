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
var unittest = require('./lib/unittest');
var path = require('path');

var config_file ='/applications/maximo/businessobjects/src/psdi/unittest/';

var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new client configuration for unit test',
  properties: {
    test_real_time: {
      description: "This test is a real time test yes ou no",
      pattern: /^.*\b(yes|no)\b.*$/,
      message: "Please, the answer must be yes or no",
      required: true,
      default: 'yes',
      _cli: 'test_real_time'
    },
    test_timeout: {
      description: "Test timeout in milliseconds",
      pattern: /^[0-9]+$/, //Implement the right 
      message: 'The test timeout is a number, positive and should be consider in milliseconds',
      required: true,
      _cli: 'test_timeout',
      default: '1000',
    },
    test_rmi_url: {
      description: "Test RMI url ",
      pattern: /^(?:([rmi]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,
      message: "you must provide a test RMI url",
      required: true,
      _cli: 'test_rmi_url',
      default: 'rmi://localhost/MXServer',
    },
    test_reports: {
      description: "Test report generator into client config",
      pattern: /^.*\b(yes|no)\b.*$/,
      message: "Please, the answer must be yes or no",
      required: true,
      default: 'no',
      _cli: 'test_reports'
    },
    test_name: {
      description: "Test case listener class's name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must follow Java conventions to define a Test Listener class name (i.e MyTestListener)',
      required: true,
      _cli: 'test_name',
      _cli_arg_value: '<ClassName>',
      default: 'MyTestListener',
      conform: function (v) {
        schema.properties.test_name_lower.default = v.toLowerCase();
        return true;
      }
    },
    test_name_lower: {
      _prompt: false,
      description: "Test listener in lower case",
      pattern: /^[a-z_0-9 ]+$/,
      message: "Test listener in lower case",
      required: true,
      _cli: 'script_description',
    },
    test_package: {
      description: "FQN for test java package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'test_package'
    },
  }
};

cli.process(schema, process.argv, create_script);

function create_script(result) {
  env.validateAddonDir();
  //populate results into the args value
  var args = Object.assign({}, env.props, result);
  //Specialize the templates into unittest lib. 
  unittest.installTemplateUTT("unittest/configfile", env.addonDir(), args);
  unittest.generateClientConfigStubFile(args);

}
