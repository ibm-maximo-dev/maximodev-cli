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
var mustache = require('mustache');

var sfv = module.exports = Object.create({});

var templateArgs; 

/**
 * Install and verify the variable from SFV.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
sfv.installTemplateSFV = function(template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);
  //Shadowing ?
  this.templateArgs = templateArgs;
  //Validate SFV template name - never used
  if (!templateArgs.SFV_name_lower) {
    if (templateArgs.SFV_name!==undefined){
     templateArgs.SFV_name_lower = templateArgs.SFV_name.toLowerCase();
    }
  }

  //Validate java package dir - never used
  if (!templateArgs.java_package_dir) {
    if (templateArgs.java_package_dir!==undefined){
     templateArgs.java_package_dir = path.join(...templateArgs.java_package.split('.'));
    }
  }


  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function(f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      sfv.installTemplateSFVFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

/**
 * Handle the SFV template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
sfv.installTemplateSFVFile = function(template, outBaseDir, filePath, templateArgs) {
  var destPath = templates.render(filePath, templateArgs);
 
  // handle dbc scripts
  var script = dbcscripts.script(path.basename(template));
  if (script) {
    var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
    destPath = path.join(path.dirname(destPath), destScript);
    log.info("Installing DBC template Files for sfv: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
    return;
  } //Ending DBC installing process for sfv

  log.info("SFV structure installing at: %s", destPath);
  templateArgs.code_py = "{{code_py}}";
  templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};



/**
 * Update scripts for automation scripts (Build)
 * @param {*} fdir Script .in complete file's path
 */
sfv.updateScrips = function (fdir) {
  shell.ls("-R", fdir).forEach(function(f) {
    //list all files into the script directory
    
    var complete_path = path.join(fdir, f);
    
    //find the .in scripts
    if (complete_path.endsWith(".in")){
      console.log("File:"+f);
      console.log("File path:"+complete_path);
      //Check if this file exists
      if (fs.existsSync(complete_path)) {
        //rename it to read the code script related to .in file
        //log.info("Before:"+complete_path);
        var codeScript = complete_path.substring(0,complete_path.length -3);
        //log.info("After:"+codeScript);
        codeScript += ('.'+this.templateArgs.file_extension);
        log.info("Extension change:"+codeScript);
        //read the content of .py file.
        codeScript = sfv.readFile(codeScript);
        //Read in script content
        scriptFile = sfv.readFile(complete_path);
        //create the args for templates. 
        var args = {
          code_py: sfv.validateCode(codeScript),
        };
        //Log info for content.
        //log.info("Arguments:"+args.code_py);
        //log.info("File .in content:"+scriptFile);
        /**
          * After read the content, the script will render the updated script into the .in file  
          */
        var rendered = sfv.render(scriptFile, args)
        //log.info("Content Loaded:"+rendered);
        if (rendered) {
          //Rename and clean up the stubs. 
          sfv.renameInFileName(complete_path,rendered);
        }
      }
    }
  });
  //Script changed.
  log.info("Scripts were validated");
};

/**
 * After finalize the process it will save changes and rename files appropriately.
 * @param {*} inFilePath Location of .in file. 
 * @param {*} rendered Content rendered by mustache to be recorded.
 */
sfv.renameInFileName= function (inFilePath,rendered){
  
  var newName = inFilePath.substring(0,inFilePath.length - 3);
  //define path for script file
  //var scriptFile = inFilePath.substring(0,inFilePath.length - 3)+'.'+this.templateArgs.file_extension;
  
  //log.info("Content Rendered:"+rendered);
  //Ensure dir path
  //fs.ensureDirSync(path.dirname(inFilePath));
  fs.writeFileSync(newName, rendered, "utf8");
  
  //copy instead of rename.
 // fs.createReadStream(inFilePath).pipe(fs.createWriteStream(newName));
  //Rename fi
  // fs.rename(inFilePath,newName,function(err){
  //   if (err){
  //     console.log("ERROR:"+err);
  //   }
  // });
  //Remove Py file.
  // fs.remove(scriptFile,function(err){
  //   if (err){
  //     console.log("ERROR:"+err);
  //   }
  // });
}
/**
 * Read the content of a python class in order to treat it. 
 * @param {*} codeScriptPath Path where the .py script is.
 */
sfv.readFile = function(codeScriptPath){
  //log.info("Reading file:"+codeScriptPath);
  var result = fs.readFileSync(codeScriptPath,"utf8",function(err,data){
    if(err){
      return console.log(err);
    }
    console.log(data);
  });
  //log.info("Content:"+result);
  return result;
}
/**
 * Validate Python script in order to have the result of this process injected into a DBC file.
 * @param {*} codeScript Content of a python script file
 */
sfv.validateCode= function (codeScript){
  
  var map = new Map();
  //Define map entries.
  map.set("<","&lt;");
  map.set("&","&amp;");
  map.set(">","&gt;");
  map.set("\"","&quot;");
  map.set("'","&apos;");

  for (var entry of map.entries()){
    var key = entry[0];
    var value = entry[1];
    while(codeScript.indexOf(key) > -1){
      codeScript = codeScript.replace(key, value);
    }
  }
  return codeScript;
}


sfv.render = function (codeContent,args){
 return mustache.render(codeContent,args);
}


function pkgToDir(pkg) {
  pkg = pkg.replace(/\./g, '/');
  return pkg;
}