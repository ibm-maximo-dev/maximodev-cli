#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var cli = require('./lib/cli');
var env = require('./lib/env');

var schema = {
  _version: '0.0.1',
  _description: 'set the maximo home directory',
  properties: {
    dir: {
      required: true,
      description: 'maximo home directory',
      default: '.',
      _cli: 'dir',
      _prop: 'maximo_home',
      message: 'not a valid maximo home directory',
      conform: function (v) {
        return env.isValidMaximoHome(v);
      }
    }
    // TODO: At some point add the concept of setting this globaly
    // global: {
    //   required: false,
    //   description: 'set it globally',
    //   _cli: 'global',
    //   _yesno: 'n'
    // }

  }
};

cli.process(schema, process.argv, function (results) {
  results.maximo_home=results.dir;
  env.saveProperties(results, results.global);
});
