#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var psi = require('./lib/psi');
const fs = require('fs');
var dist = require('./lib/dist');

var schema = {
  _version: '0.0.1',
  _description: 'Create a PSI structure for an new installation ',
  properties: {
     package_name: {
      description: "Package Name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must only contain letters and numbers (i.e hotfix7960)',
      required: true,
      _cli: 'package_name',
      default: 'default'
    },
    uuid:{
      _prompt: false,
      _cli: 'uuid',
      require: false,
      default: psi.getUUID()
    }
    //TODO: Define the prompt.

  }//Ending properties.
};

//var uuid  = ;

//schema.properties['uuid'] = {_prop: 'uuid',required: true, default: uuid};



cli.process(schema, process.argv, create_package);

function create_package(result) {
  
  var args = Object.assign({}, env.props, result);

  

  //schema.properties['uuid'] = {_cli: 'uuid',_prop: 'uuid',required: true, default: uuid};

  //define the uuid property
  //result['uuid'] =  uuid;
  

  console.log("Package UUID: "+ result.uuid);
  //Install templates 
  psi.installTemplatePSI("psi", env.addonDir(), args);
  //Create Files Directory
  psi.createFILES(result.package_name);
  //Copy files into the FILES directories
  psi.copyFolderRecursiveSync('./dist/.', './installer/'+result.package_name+'Package/FILES/');
  //Zip the content from a package int a file to be installed.
  psi.zipFolderContent('./installer/'+result.package_name+'Package/FILES/',result.package_name);
   
};

