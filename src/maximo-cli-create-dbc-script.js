var dbcscripts = require('./lib/dbcscripts');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');


var schema = {
  _version: '0.0.1',
  _description: 'Maximo create new dbc file',
  properties: {
    dir: {
      required: true,
      description: 'addon script dir',
      default: env.scriptDir(),
      _cli: 'dir',
      conform: function(v) {
        schema.properties.scriptname.default = dbcscripts.nextScript(v);
        return true;
      }
    },
    scriptname: {
      required: true,
      description: 'script name',
      _cli: 'scriptname',
      conform: function(v) {
        return dbcscripts.isValidScriptName(v);
      },
      message: 'Script must be V####_##.ext'
    }
  }
};

cli.process(schema, process.argv, create_dbc_script);

function create_dbc_script(result) {
  dbcscripts.createNewScriptInDir(null, result.scriptname, result.dir)
}
