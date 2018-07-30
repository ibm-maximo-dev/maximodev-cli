/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./logger');
var fs = require('fs-extra');
var templates = require('./templates');
var dbcscripts = require('./dbcscripts');
var product = require('./productxml');
var env = require('./env');
var path = require('path');
var shell = require('shelljs');
var log = require("./logger");

var ext = module.exports = Object.create({});

ext.addFieldValidationSample = function (srcDir, templateArgs) {
  console.log("businesobjects: " + srcDir, templateArgs);
  ext.addJavaSample(srcDir, templates.resolveName('java/sample_mbo_field_validator.java'), templateArgs)
};

ext.addJavaSample = function (srcDir, template, templateArgs) {
  var pkg = templateArgs.java_package;
  var pkgDir = env.ensureDir(path.join(srcDir, pkgToDir(pkg)));
  var className = templateArgs.java_class_name;
  var outFile = path.join(pkgDir, className + ".java");
  templates.renderToFile(template, templateArgs, outFile);
  log.info("New java file created: %s", outFile);
};

/**
 * Install and verify the variable from Application Extension.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
ext.installTemplateExt = function (template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  if (!templateArgs.mbo_name) {
    var mbo_name = templateArgs.ext_id.split(".").pop(-1);
    templateArgs.mbo_name = mbo_name.toUpperCase();
  }

  if (!templateArgs.java_package_dir) {
    templateArgs.java_package_dir = path.join(...templateArgs.ext_java_package.split('.'));
  }

  if (!templateArgs.ext_id_T) {
    templateArgs.ext_id_T = ext.toTitleCase(templateArgs.mbo_name);
  }

  if (!templateArgs.ext_id_lower) {
    templateArgs.ext_id_lower = templateArgs.mbo_name.toLowerCase();
  }


  if (!templateArgs.ext_prefix_T) {
    templateArgs.ext_prefix_T = ext.toTitleCase(templateArgs.ext_prefix);
  }

  if (!templateArgs.ext_prefix_lower) {
    templateArgs.ext_prefix_lower = templateArgs.ext_prefix.toLowerCase();
  }

  if (!templateArgs.addon_id) {
    templateArgs.addon_id = templateArgs.ext_id_lower + templateArgs.ext_prefix_lower
  }

  if (!templateArgs.new_mbo) {
    templateArgs.new_mbo = templateArgs.addon_id.toUpperCase() + templateArgs.mbo_name.toUpperCase();
  }

  if (!templateArgs.ext_script_version) {
    templateArgs.ext_script_version = dbcscripts.nextScript(env.scriptDir(), "dbc");
  }

  //Build MBO information
  if (templateArgs.add_presetation || add_presetation.add_mbo) {

    if (!templateArgs.object_name) {
      templateArgs.object_name = templateArgs.mbo_name;
    }

    if (!templateArgs.mbo_fqn) {
      templateArgs.mbo_fqn = templateArgs.ext_id;
    }

    ext.installTemplateExtMbo(template, dir, templateArgs);
  }

  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function (f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      ext.installTemplateExtFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

ext.installTemplateExtField = function (template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  //build the java package dir from addon.properties
  if (!templateArgs.java_package_dir) {
    templateArgs.java_package_dir = path.join(...env.get('java_package').split('.'));
  }

  if (!templateArgs.field_name) {
    templateArgs.field_name = 'Fld' + ext.toTitleCase(env.get('addon_id')) + ext.toTitleCase(templateArgs.ext_field);
  }

  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function (f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      ext.installTemplateExtFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

ext.installTemplateExtService = function (template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  if (!templateArgs.java_package) {
    templateArgs.java_package = ((java_package = env.get("java_package")) ? java_package : env.javaPackage());
  }
  //build the java package dir from addon.properties
  if (!templateArgs.java_package_dir) {
    templateArgs.java_package_dir = path.join(...env.get('java_package').split('.'));
  }
  if (!templateArgs.addon_id) {
    templateArgs.addon_id = env.get('addon_in');
  }

  if (!templateArgs.user_service_name) {
    var service_name = ext.toTitleCase(templateArgs.addon_id) + ext.toTitleCase(templateArgs.service_name)
    templateArgs.user_service_name = service_name + 'Service';
    templateArgs.new_servicename = service_name.toUpperCase();
  }

  if (!templateArgs.script_version) {
    templateArgs.script_version = dbcscripts.nextScript(env.scriptDir(), ".dbc");
  }

  if (!templateArgs.new_service) {

  }

  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function (f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      ext.installTemplateExtFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

/**
 * Copy Mbo Extension templates to the structure.
 * @param {*} template 
 * @param {*} dir 
 * @param {*} templateArgs 
 */
ext.installTemplateExtMbo = function (template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  //Get Mbo name to be extended
  if (!templateArgs.mbo_name) {
    var mbo_name = templateArgs.mbo_fqn.split(".").pop(-1);
    templateArgs.mbo_name = mbo_name.toUpperCase();
  }

  if (!templateArgs.java_package) {
    templateArgs.java_package = ((java_package = env.get("java_package")) ? java_package : 'ibm.com.maximo');
  }

  if (!templateArgs.java_package_dir) {
    //Reading the addon java package from addon properties file
    if (templateArgs.java_package) {
      templateArgs.java_package_dir = path.join(...templateArgs.java_package.split('.'));
    } else {
      throw new Error("No addon package information, ensure you are running this command inside a addon directory.");
    }

  }

  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function (f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      ext.installTemplateExtFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

/**
 * Handle the Application Extension template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
ext.installTemplateExtFile = function (template, outBaseDir, filePath, templateArgs) {
  var destPath = templates.render(filePath, templateArgs);

  // handle dbc scripts
  var script = dbcscripts.script(path.basename(template));
  if (script) {
    var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
    destPath = path.join(path.dirname(destPath), destScript);
    log.info("Installing DBC File for Exts: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
    return;
  } //Ending DBC installing process for Application Extensions

  log.info("Application Extension structure installing at: %s", destPath);
  templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};


ext.isValidExtension = function (dir) {
  dir = dir || env.addonDir() || '.';

  var extPath = env.ensureDir(path.join(dir, "ext"));

};

/**
 * Function to transform a package in a directory.
 * @param {*} pkg 
 */
function pkgToDir(pkg) {
  pkg = pkg.replace(/\./g, '/');
  return pkg;
}


/**
 * Update the product xml file to support field classes extensions
 * @param {*} args Arguments from command line prompt
 */
ext.addFieldClassesToProductXML = function (args) {
  //START: Save the field class to the product.xml extension element
  var mbo = args.ext_mbo;
  var existingClass = args.ext_fqn_field;

  //Check if addon is present.
  if (ext.checkAddon()) {
    var newClass = env.get('java_package') + '.Fld' + ext.toTitleCase(env.get('addon_id')) + ext.toTitleCase(args.ext_field);
    product.addFieldExtension(mbo, args.ext_field, existingClass, newClass);
  }
  //END: Save the field class to the product.xml extension element
}

/**
 * Add extended Mbos to the structure.
 * @param {*} args commnad line arguments.
 */
ext.addMboClassesToProductXML = function (args) {
  //START: Save the field class to the product.xml extension element
  var mbo_fqn = args.mbo_fqn;
  var app_prefix = args.ext_prefix_T;
  var object_name = args.ext_id_T;
  var java_package = args.java_package;
  var newClass = java_package + '.' + app_prefix + object_name;
  product.addMboExtension(object_name, mbo_fqn, newClass);
  //END: Save the field class to the product.xml extension element
}

/**
 * Add a Service Class to the structure
 * @param {*} args command line arguments.
 */
ext.addServiceClassesToProductXML = function (args) {
  //START: Save the Service class to the product.xml extension element
  var service_fqn = args.service_fqn;
  var service_name = args.service_name;
  var addon_id = args.addon_id;
  var java_package = args.java_package;
  var newClass = args.user_service

  console.log("Adding service to the product.xml file");

  if (!addon_id) {
    addon_id = env.get('addon_id');
  }
  console.log("Addon_id: %s", addon_id);

  //Check if the Addon exists before continue/was initialize
  if (ext.checkAddon()) {
    var newClass = java_package + '.' + ext.toTitleCase(addon_id) + service_name + 'Service';
    product.addServiceExtension(service_name, service_fqn, newClass);
  }
  //Add remote extensions if necessary
  if (args.add_remote_service) {
    var newClass = java_package + '.' + ext.toTitleCase(addon_id) + ext.toTitleCase(service_name) + 'ServiceRemote';
    product.addRemoteServiceExtension(service_name, service_fqn, newClass);
  }
  //END: Save the Service class to the product.xml extension element
}

/**
 * Check if the addon is presented.
 */
ext.checkAddon = function () {
  if (!env.get('addon_id')) {
    throw new Error("You are not in a addon directory. Please, create or initialize your addon!");
  }
  return true;
}


/**
 * Modify names to java standards
 * @param {*} string Java Class name candidate.
 */
ext.toTitleCase = function (string) {
  if (!string) {
    throw console.error("String is empty" + string);
  }
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
