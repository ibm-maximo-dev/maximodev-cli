#! /usr/bin/env node

var dbcscripts = require('./lib/dbcscripts');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var mbo = require('./lib/mbos');
var installer = require("./lib/template_installers");


var schema = {
  _version: '0.0.1',
  _description: 'create a MBO structure for a new Maximo application/customization ',
  properties: {
    add_sample: {
      description: "Are you sure to create the MBO structure for an application?",
      required: true,
      _cli: 'add_sample',
      _yesno: 'n',
    },
    add_java_support: {
      description: "Add Java support?",
      required: true,
      _cli: 'java_support',
      _yesno: true,
      default: 'n'
    },
    java_package: {
      description: "Default Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'java_package',
      _depends: 'add_java_support',
    },
    mbo_name: {
      description: "Mbo class name",
      pattern: /^[a-zA-Z]+$/,
      message: 'Must only contain letters (i.e MYTABLE)',
      required: true,
      _cli: 'mbo_name',
      _cli_arg_value: '<ClassName>',
      _prop: 'mbo_name',
      default: 'XMBO'
    }
    // output_directory: {
    //   description: "Create addon in directory",
    //   required: true,
    //   _cli: 'output_directory',
    //   default: '.',
    //   conform: function(v) {
    //     if (v.length>5) return false;
    //     schema.properties.output_directory.default = v.toLowerCase();
    //     schema.properties.java_package.default = v.toLowerCase();
    //     return true;
    //   }
    //}//Ending out put directory
    
  }//Ending properties.
};

cli.process(schema, process.argv, create_mbo);

function create_mbo(result) {
  
  // if (!env.bool(result.add_sample)) {
  //   log.info("MBO not created");
  //   process.exit(0);
  // }

  var args = Object.assign({}, env.props, result);
  // if (!args.java_package) {
  //   log.error("This command generates MBO java files  is not configured for Java support.  You need to install java support first using 'maximo-cli init java'");
  //  process.exit(1);
  // } //Check for any variable that should be created

  
  installer.installTemplateMbo("mbos", env.addonDir(), args);
}

