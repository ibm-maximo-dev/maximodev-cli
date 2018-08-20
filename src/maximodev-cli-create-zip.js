#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var zip = require('./lib/zip');
var shell = require('shelljs');


var _date = Date.now();
var _name = env.addonId();

if (!_name) {
  _name = 'maximodev-cli-';
}

_name = (_name + '-' + _date.toString());



var schema = {
  _version: '0.0.1',
  _description: 'Create a ZIP package structure for an new installation ',
  properties: {
    package_name: {
      description: "ZIP Package Name",
      pattern: /^[a-zA-Z0-9_.-]+$/,
      message: 'Must only contain letters and numbers (i.e hotfix7960)',
      required: true,
      _cli: 'package_name',
      default: _name
    },
  }//Ending properties.
};


cli.process(schema, process.argv, create_package);

function create_package(result) {

  var args = Object.assign({}, env.props, result);
  /**
   * For future versions the installation will be able to be done by the IBM Installation Manager or solutionintaller. 
   */
  var build_dir = 'dist/.';
  if (zip.ensureDir(build_dir)) {

    //Install templates 
    zip.installTemplateZIP("zip", env.addonDir(), args);
    
    //Create tmp directory
    if (!env.ensureDir('tmp')) {
      shell.mkdir("-p", 'tmp');
    }
    //Copy folders recursively 
    zip.copyFolderRecursiveSync(build_dir, 'tmp/' + result.package_name + '/');

    console.log('location %s', result.package_name)
    //Zip the content from a package int a file to be installed.



    zip.zipFolderContent('./tmp/' + result.package_name + '/', result.package_name + '.zip')
      .then(function (base) {
        console.log("Your package were created into the zip folder of this project. Unzip the package into MAXIMO's installation folder and then run the updatedb command to install it");
      });
  } else {
    console.log('Package is note ready, please build the package before zip it (i.e. run maximodev build)');
  }//End ensure dir

  console.log("Moving %s to dist folder",  result.package_name + '.zip ');
  if(shell.exec('mv ' + result.package_name + '.zip dist/').code !== 0) {
    shell.echo('Error: Move command fail commit failed');
    shell.exit(1);
  }
  console.log("Clean up ...");
  if(shell.exec('rm -rf tmp/').code !== 0){
    shell.echo('Error: Removing tmp directory');
    shell.exit(1);
  };

};

