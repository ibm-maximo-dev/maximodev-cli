var log = require('./logger');
var fs = require('fs-extra');
var templates = require('./templates');
var dbcscripts = require('./dbcscripts');
var env = require('./env');
var path = require('path');
var util = require('util');

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

function pkgToDir(pkg) {
  pkg = pkg.replace(/\./g, '/');
  return pkg;
}