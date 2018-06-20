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
var shell = require('shelljs');

var cui = module.exports = Object.create({});


/**
 * Install and verify the variable from CUI.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
cui.installTemplateCUI = function (template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);
  //Shadowing ?
  this.templateArgs = templateArgs;

  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function (f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      //Find the dbc into the condition UI script
      cui.installTemplateCUIFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

/**
 * Handle the CUI template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
cui.installTemplateCUIFile = function (template, outBaseDir, filePath, templateArgs) {
  var destPath = templates.render(filePath, templateArgs);

  // handle dbc scripts
  var script = dbcscripts.script(path.basename(template));
  if (script) {
    var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
    destPath = path.join(path.dirname(destPath), destScript);
    log.info("Installing DBC template Files for cui: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
    return;
  } //Ending DBC installing process for cui

  log.info("CUI structure installing at: %s", destPath);
  templateArgs.code_script = "{{code_script}}";
  templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};

/**
 * Update scripts for automation scripts (Build)
 * @param {*} fdir Script .in complete file's path
 */
cui.updateScrips = function (fdir) {
  shell.ls("-R", fdir).forEach(function (f) {
    //list all files into the script directory

    var complete_path = path.join(fdir, f);

    //find the .in scripts
    if (complete_path.endsWith(".in")) {
      console.log("File:" + f);
      console.log("File path:" + complete_path);
      //Check if this file exists
      if (fs.existsSync(complete_path)) {
        //rename it to read the code script related to .in file
        //log.info("Before:"+complete_path);

        var codeScript = complete_path.substring(0, complete_path.length - 3);
        //log.info("After:"+codeScript);
        var script_extension = cui.getScriptExtension(f.substring(0, f.length - 7), fdir);
        codeScript += script_extension
        //log.info("Extension change:" + codeScript);
        //read the content of .py file.
        codeScript = cui.readFile(codeScript);
        //Read in script content
        scriptFile = cui.readFile(complete_path);
        //create the args for templates. 
        var args = {
          code_script: cui.validateCode(script_extension, codeScript),
        };
        /**
          * After read the content, the script will render the updated script into the .in file  
          */
        var rendered = cui.render(scriptFile, args)
        //log.info("Content Loaded:"+rendered);
        if (rendered) {
          //Rename and clean up the stubs. 
          cui.renameInFileName(complete_path, rendered);
        }
      }
    }
  });
  //Script changed.
  log.info("Scripts were validated");
};
