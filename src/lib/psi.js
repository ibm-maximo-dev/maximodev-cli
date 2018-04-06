var log = require('./logger');
var fs = require('fs-extra');
var templates = require('./templates');
var dbcscripts = require('./dbcscripts');
var env = require('./env');
var path = require('path');
var fs = require('fs');
var util = require('util');
var shell = require('shelljs');
var log = require("./logger");
var archiver = require('archiver');
var zipArchive = archiver('zip');

/** 
 * The uuid v4 will be used to replace the uuid property in order to generate the unique id for this PSI package. 
 * TODO: Replace the variable in the right place.
 */
const uuidv4 = require('uuid/v4'); 




var psi = module.exports = Object.create({});


psi.getUUID = function(){
    return uuidv4();
};

/**
 * Install and verify the variable from MBO.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
psi.installTemplatePSI = function(template, dir, templateArgs) {
  dir = dir || env.addonDir() || '.';
  env.ensureDir(dir);

  if (!templateArgs.java_package_dir) {
     templateArgs.java_package_dir = path.join(...templateArgs.java_package.split('.'));
  }


  log.info("Install %s into %s", template, dir);
  var tdir = templates.resolveName(template);
  shell.ls("-R", tdir).forEach(function(f) {
    if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
      psi.installTemplatePSIFile(path.resolve(tdir, f), dir, f, templateArgs);
    }
  });
};

/**
 * Handle the PSI template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
psi.installTemplatePSIFile = function(template, outBaseDir, filePath, templateArgs) {
  var destPath = templates.render(filePath, templateArgs);
 
  // handle dbc scripts
  var script = dbcscripts.script(path.basename(template));
  if (script) {
    var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
    destPath = path.join(path.dirname(destPath), destScript);
    log.info("Installing DBC File for psi: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
    return;
  } //Ending DBC installing process for psi

  log.info("PSI structure installing at: %s", destPath);
  templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};


psi.pkgToDir = function (pkg){
  pkg = pkg.replace(/\./g, '/');
  return pkg;
};
/**
 * Copy from target files
 * 
 */

psi.copyFileSync = function ( source, target ) {

    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    //target file will be read
    fs.writeFileSync(targetFile, fs.readFileSync(source));
};

/**
 * Needs create the FILE storage folder
 * @param {*} projectName 
 */
psi.createFILES = function (projectName){
    var filesPath = './installer/'+projectName+'Package/FILES';
    if ( !fs.existsSync( filesPath ) ) {
      fs.mkdirSync( filesPath );
  }
};
/**
 *  Copy folder recursively.
 * @param {*} source 
 * @param {*} target 
 */
psi.copyFolderRecursiveSync= function ( source, target ) {
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
                psi.copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                psi.copyFileSync( curSource, targetFolder );
            }
        } );
    }
};

/**
 * Zip the content from FILES into a package
 */
psi.zipFolderContent = function (destDir, package_name){

  var output = fs.createWriteStream(path.join(destDir+'/'+package_name+'Package.zip'));
  // pipe archive data to the output file
  zipArchive.pipe(output);
  
    //zipArchive.bulk([{src: [path.join(destDir, '*.*')],  expand: true}]);
    zipArchive.directory(destDir,package_name+'Package.zip');
    zipArchive.finalize(function(err, bytes) {
      if (err)
          throw err;

    console.log('Package zip done:', base, bytes);
  });
  
};