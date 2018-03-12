var log = require('./logger');
var env = require('./env');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var util = require('util');

var presentations = module.exports = Object.create({});

/**
 * Given a presentation directory, combine all xml files into a single presentation set*
 */
presentations.combine = function(srcDir, outFile) {
  log.debug('Creating %s', outFile);
  shell.mkdir('-p', path.dirname(outFile));
  env.writeFile(outFile, '<?xml version="1.0" encoding="UTF-8" ?>\n');
  env.appendFile(outFile, '<presentationset id="presentationset">\n');

  shell.ls('-R', srcDir).forEach(function(f) {
    if (!fs.lstatSync(path.join(srcDir, f)).isDirectory()) {
      shell.sed(/<\?xml.*/, '', path.join(srcDir, f)).toEnd(outFile);
      env.appendFile(outFile, '\n');
      log.debug('Added %s', f);
    }
  });

  env.appendFile(outFile, '</presentationset>');
};

presentations.diff = function(orig, newfile, outdbc) {
  log.info("Presentation Diff %s %s -> %s", orig, newfile, outdbc);

  var classpath = env.resolveMaximoPath([
    'tools/maximo/classes',
    'applications/maximo/businessobjects/classes',
    'applications/maximo/maximouiweb/webmodule/WEB-INF/classes',
    'applications/maximo/lib/log4j-1.2.16.jar'
  ]);
  var command = "psdi.webclient.upgrade.MXScreenDiff";
  var cmd = util.format('java -cp "%s" %s -b"%s" -m"%s" -t"%s" -q', makeClassPath(classpath), command, orig, newfile, outdbc);

  log.debug("Issuing Java Command\n%s", cmd);

  shell.cd(env.maximoToolsHome());
  if (shell.exec(cmd).code!==0) {
    log.error("command failed!");
  } else {
    if (!fs.existsSync(path.resolve(outdbc))) {
      log.error("Presentation diff did not create a file");
    } else {
      log.info("created %s", outdbc);
    }
  }
};

function makeClassPath(items) {
  return items.join(path.delimiter);
}
