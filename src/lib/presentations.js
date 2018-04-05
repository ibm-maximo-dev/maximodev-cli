/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./logger');
var env = require('./env');
var dbcscripts = require('./dbcscripts');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var util = require('util');
var tmp = require('tmp');

var presentations = module.exports = Object.create({});

/**
 * Given a presentation directory, combine all xml files into a single presentation set*
 */
presentations.combine = function(srcDir, outFile) {
  log.debug('Creating %s', outFile);
  shell.mkdir('-p', path.dirname(outFile));
  env.writeFile(outFile, '<?xml version="1.0" encoding="UTF-8" ?>\n');
  env.appendFile(outFile, '<presentationset id="presentationset">\n');

  var haveToolbox = false;

  if (fs.existsSync(srcDir)) {
    shell.ls('-R', srcDir).forEach(function (f) {
      if (f.endsWith('.xml')) {
        if (f.endsWith('toolbox.xml')) haveToolbox=true;
        if (!fs.lstatSync(path.join(srcDir, f)).isDirectory()) {
          shell.sed(/<\?xml.*/, '', path.join(srcDir, f)).toEnd(outFile);
          env.appendFile(outFile, '\n');
          log.debug('Added %s', f);
        }
      }
    });
  }

  // toolbox defines things like powerapp, etc, and mxdiff fails outside of maximo if it does not have
  // know about it.  ( TODO: we should really update mxdiff )
  if (!haveToolbox) {
    var tb = env.resolveMaximoPath('resources/presentations/system/toolbox.xml');
    if (!fs.existsSync(tb)) {
      log.warn('Unable to pull in the maximo toolbox.xml which is needed when doing presentationsets for diffing.  The diff creation may fail.');
    }
    shell.sed(/<\?xml.*/, '', tb).toEnd(outFile);
    env.appendFile(outFile, '\n');
    log.debug('Added %s', tb);
  }


  env.appendFile(outFile, '</presentationset>');
};

presentations.diff = function(orig, newfile, outdbc) {
  log.info("Presentation Diff %s %s -> %s", orig, newfile, outdbc);

  orig = path.resolve(orig);
  newfile = path.resolve(newfile);
  outdbc = path.resolve(outdbc);

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

presentations.diffAll = function(baseDir, newDir, outdbc) {
  var tmpBase = tmp.fileSync();
  var tmpNew = tmp.fileSync();
  // var tmpBase = {name: 'orig.xml'};
  // var tmpNew = {name: 'new.xml'};
  var tmpBaseName = path.resolve(tmpBase.name);
  var tmpNewName = path.resolve(tmpNew.name);
  presentations.combine(baseDir, tmpBaseName);
  presentations.combine(newDir, tmpNewName);
  presentations.diff(tmpBaseName, tmpNewName, outdbc);
  tmpBase.removeCallback();
  tmpNew.removeCallback();
};

/**
 * Returns # of presentation xmls in your dev area.  Can be used to check if thre are any presentations.
 *
 * @param dir
 * @returns {number}
 */
presentations.haveAny = function(dir) {
  let count=0;
  shell.ls('-R', path.join(dir,'*.xml')).forEach(()=>count++);
  return count;
};

presentations.diffAllForAddon = function(baseDir, newDir, outdbc) {
  baseDir = baseDir || 'BASE';
  newDir = newDir || env.addonDir('resources/presentations/');
  outdbc = outdbc || dbcscripts.getMxsScript();

  if (fs.existsSync(newDir) && presentations.haveAny(newDir)) {
    log.info("Creating Presentation Delta File: " + outdbc);
    presentations.diffAll(baseDir, newDir, outdbc);
  }
};