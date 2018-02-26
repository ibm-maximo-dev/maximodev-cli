#! /usr/bin/env node

var dbcscripts = require('./lib/dbcscripts');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var fs = require('fs-extra');
var path = require('path');


var schema = {
  _version: '0.0.1',
  _description: 'Create presentation xml difference file',
  properties: {
    original: {
      required: true,
      description: 'original presentation xml file',
      _cli: 'base',
      message: 'file does not exist',
      conform: function(v) {
        if (fs.existsSync(v)) {
          return true;
        }
        return false;
      }
    },
    modified: {
      required: true,
      description: 'modified presentation xml file',
      _cli: 'modified',
      conform: function(v) {
        return fs.existsSync(v);
      },
      message: 'file does not exist'
    },
    output: {
      required: true,
      description: 'database output script',
      _cli: 'output',
      default: dbcscripts.nextScriptFile(env.scriptDir(), 'mxs'),
      conform: function(v) {
        return !fs.existsSync(v);
      },
      message: 'output file already exists, specify another file'
    }
  }
};

cli.process(schema, process.argv, run_mxsdiff);

function run_mxsdiff(result) {
  log.info("    Base %s", result.original);
  log.info("Modified %s", result.modified);
  log.info("  Output %s", result.output);

  var util = require('util');
  var shell = require('shelljs');
  var path = require('path');

  var classpath = env.resolveMaximoPath([
    'tools/maximo/classes',
    'applications/maximo/businessobjects/classes',
    'applications/maximo/maximouiweb/webmodule/WEB-INF/classes',
    'applications/maximo/lib/log4j-1.2.16.jar'
  ]);
  var command = "psdi.webclient.upgrade.MXScreenDiff";
  var cmd = util.format('java -cp "%s" %s -b"%s" -m"%s" -t"%s" -q', makeClassPath(classpath), command, path.resolve(result.original), path.resolve(result.modified), path.resolve(result.output));

  log.debug("Issuing Java Command\n%s", cmd);

  shell.cd(env.maximoToolsHome());
  if (shell.exec(cmd).code!==0) {
    log.error("command failed!");
  } else {
    if (!fs.existsSync(path.resolve(result.output))) {
      log.error("Presentation diff did not create a file");
    } else {
      log.info("created %s", result.output);
    }
  }
}

function makeClassPath(items) {
  return items.join(path.delimiter);
}
