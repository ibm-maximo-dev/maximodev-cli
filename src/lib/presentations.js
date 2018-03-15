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

  var command = "psdi.webclient.upgrade.MXScreenDiff";
  var args = util.format('-b"%s" -m"%s" -t"%s" -q', orig, newfile, outdbc);

  env.runMaximoTool(command, args, null, function(cmd, proc) {
    if (!fs.existsSync(path.resolve(outdbc))) {
      log.error("Presentation diff did not create a file");
    } else {
      log.info("created %s", outdbc);
    }
  }, function (cmd, proc) {
    log.error("The presentation diff tool failed to process the screens.");
  });
};
