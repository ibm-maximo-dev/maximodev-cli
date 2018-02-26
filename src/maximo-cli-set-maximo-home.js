#! /usr/bin/env node

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
    },
    global: {
      required: false,
      description: 'set it globally',
      _cli: 'global',
      _yesno: 'n'
    }

  }
};

cli.process(schema, process.argv, function (results) {
  results.maximo_home=results.dir;
  env.saveProperties(results, results.global);
});
