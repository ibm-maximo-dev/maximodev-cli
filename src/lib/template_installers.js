var fs = require('fs-extra');
var path = require('path');
var shell = require('shelljs');
var env = require('./env');
var templates = require('./templates');
var log = require("./logger");

var template_installers = module.exports = Object.create({});

template_installers.installTemplate = function(srcDir, destDir) {
  copyFolderRecursiveSync(srcDir, destDir);
};

template_installers.installJavaSupport = function(dir) {
  dir = dir || '.';

  env.ensureDir(dir);

  log.info("Copying gradle build files for java into %s", dir);
  shell.cp('-r', templates.resolveName('gradle/*'), dir);
  if (!fs.existsSync(path.join(dir, 'addon.properties'))) {
    log.warn("addon.properties is missing and Java will require it.  You should run 'maximo-cli init addon' to initialize it.");
  }
};



function copyFileSync( source, target ) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
    if ( fs.lstatSync( target ).isDirectory() ) {
      targetFile = path.join( target, path.basename( source ) );
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
    fs.mkdirSync( targetFolder );
  }

  //copy
  if ( fs.lstatSync( source ).isDirectory() ) {
    files = fs.readdirSync( source );
    files.forEach( function ( file ) {
      var curSource = path.join( source, file );
      if ( fs.lstatSync( curSource ).isDirectory() ) {
        copyFolderRecursiveSync( curSource, targetFolder );
      } else {
        copyFileSync( curSource, targetFolder );
      }
    } );
  }
}