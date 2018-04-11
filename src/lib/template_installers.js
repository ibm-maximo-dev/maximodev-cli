/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var fs = require('fs-extra');
var path = require('path');
var shell = require('shelljs');
var env = require('./env');
var templates = require('./templates');
var log = require("./logger");
var dbcscripts = require("./dbcscripts");

var template_installers = module.exports = Object.create({});

template_installers.installJavaSupport = function(dir) {
  dir = dir || '.';

  env.ensureDir(dir);

  log.info("Copying gradle build files for java into %s", dir);
  shell.cp('-r', templates.resolveName('gradle/*'), dir);
  if (!fs.existsSync(path.join(dir, 'addon.properties'))) {
    log.warn("addon.properties is missing and Java will require it.  You should run 'maximo-cli init addon' to initialize it.");
  }
  // update our project name in the settings file
  templates.renderToFile(templates.resolveName('gradle/settings.gradle'), env.props, path.join(dir, 'settings.gradle'))
};

template_installers.installTemplateApp = function(template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  if (!templateArgs.addon_prefix_lower) {
    templateArgs.addon_prefix_lower = templateArgs.addon_prefix.toLowerCase();
  }

  if (!templateArgs.java_package_dir) {
    templateArgs.java_package_dir = path.join(...templateArgs.java_package.split('.'));
  }


  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function(f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      template_installers.installTemplateAppFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

template_installers.installTemplateAppFile = function(template, outBaseDir, filePath, templateArgs) {
  var destPath = templates.render(filePath, templateArgs);

  // handle product xmls
  if (path.resolve(env.productXml()) == path.resolve(path.join(outBaseDir, destPath))) {
    log.warn("product xml will not be overwritten.  Will merge extensions if any.");
    // TODO: merge extensions
    return;
  }

  // handle dbc scripts
  var script = dbcscripts.script(path.basename(template));
  if (script) {
    var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
    destPath = path.join(path.dirname(destPath), destScript);
    log.info("Installing DBC File: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
    return;
  }

  log.info("Installing: %s", destPath);
  templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};
