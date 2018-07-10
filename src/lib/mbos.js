/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./logger');
var fs = require('fs-extra');
var templates = require('./templates');
var dbcscripts = require('./dbcscripts');
var env = require('./env');
var path = require('path');
var util = require('util');
var shell = require('shelljs');
var log = require("./logger");

var mbos = module.exports = Object.create({});

mbos.addFieldValidationSample=function(srcDir, templateArgs) {
  console.log("businesobjects: " + srcDir, templateArgs);
  mbos.addJavaSample(srcDir, templates.resolveName('java/sample_mbo_field_validator.java'), templateArgs)
};

mbos.addJavaSample = function(srcDir, template, templateArgs) {
  var pkg = templateArgs.java_package;
  var pkgDir = env.ensureDir(path.join(srcDir, pkgToDir(pkg)));
  var className = templateArgs.java_class_name;
  var outFile = path.join(pkgDir, className + ".java");
  templates.renderToFile(template, templateArgs, outFile);
  log.info("New java file created: %s", outFile);
};

/**
 * Install and verify the variable from MBO.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
mbos.installTemplateMbo = function(template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  if (!templateArgs.mbo_name_lower) {
     templateArgs.mbo_name_lower = templateArgs.mbo_name.toLowerCase();
  }

  if (!templateArgs.java_package_dir) {
     templateArgs.java_package_dir = path.join(...templateArgs.java_package.split('.'));
  }

  // if (!templateArgs.script || (templateArgs.script.trim()=='')){
  //   templateArgs.script = dbcscripts.substr(0,dbcscripts.indexOf('.'));
  // }

  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function(f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      mbos.installTemplateMboFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

/**
 * Handle the MBO template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
mbos.installTemplateMboFile = function(template, outBaseDir, filePath, templateArgs) {
  var destPath = templates.render(filePath, templateArgs);
 
  // handle dbc scripts
  var script = dbcscripts.script(path.basename(template));
  if (script) {
    var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
    destPath = path.join(path.dirname(destPath), destScript);
    log.info("Installing DBC File for Mbos: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
    return;
  } //Ending DBC installing process for MBOs

  log.info("MBO structure installing at: %s", destPath);
  templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};


function pkgToDir(pkg) {
  pkg = pkg.replace(/\./g, '/');
  return pkg;
}