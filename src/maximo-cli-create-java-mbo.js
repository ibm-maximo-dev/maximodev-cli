#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var mbo = require('./lib/mbos');

var schema = {
  _version: '0.0.1',
  _description: 'create a MBO structure for a new Maximo application/customization ',
  properties: {
    add_sample: {
      description: "Are you sure to create the MBO structure for an Maximo application?",
      required: true,
      _cli: 'add_sample',
      _yesno: 'n',
    },
    java_package: {
      description: "Default Java Package",
      pattern: /^[a-zA-Z_0-9.]+$/,
      message: 'Must only contain letters, numbers, underscores, or dots',
      required: true,
      _cli: 'java_package',
    },
    mbo_name: {
      description: "Mbo Name",
      pattern: /^[A-Z]+$/,
      message: 'Must only contain capital letters(i.e MYTABLE)',
      required: true,
      _cli: 'mbo_name',
      _prop: 'mbo_name',
      default: 'MYTABLE'
    },
    mbo_class_name: {
      description: "Mbo class name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must contain  (i.e MyTable)',
      required: true,
      _cli: 'mbo_class_name',
      _cli_arg_value: '<ClassName>',
      _prop: 'mbo_class_name',
      default: 'MyTable'
    },
    dbc_script: {
      description: "Adding DBC Script",
      required: true,
      _cli: 'dbc_script',
      _yesno: true,
      default: 'y'
    },
    dbc_prefix: {
      description: "DBC prefix (i.e. DBC file prefix)",
      _depends: 'dbc_script',
      pattern: /^[A-Z0-9]+$/,
      message: 'Must capital letters only with a number (i.e V1000)',
      required: true,
      _cli: 'dbc_prefix',
      _prop: 'dbc_prefix',
      default: 'V1000'
    },
    dbc_version: {
      description: "DBC Version",
      _depends: 'dbc_script',
      pattern: /^[0-9]+$/,
      message: 'Must be a sequency of numbers',
      required: true,
      _cli: 'dbc_version',
      _prop: 'dbc_version',
      default: '01'
    },
    addon_id: {
      description: "Target application name",
      _depends: 'dbc_script',
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, and underscores',
      required: true,
      _cli: 'addon_name',
      conform: function(v) {
        schema.properties.java_package.default = v.toLowerCase().replace('_','.');
        return true;
      }
    },
    dbc_folder: {
      description: "What is the DBC script's folder name",
      _depends: 'dbc_script',
      required: true,
      _cli: 'dbc_folder',
      _prop: 'dbc_folder',
      default: 'tools/maximo/en/'
    },
    add_service_support: {
      description: "Add a Mbo's service support? If you do not specify one, the ASSET's service will be taken as default.",
      required: true,
      _cli: 'java_support',
      _yesno: true,
      default: 'n'
    },
    service_name: {
      description: "What would be the service name?",
      _depends: 'add_service_support',
      message: 'It must contains capital letters only and should have no more then 18 characters',
      pattern: /^[A-Z]+$/,
      required: true,
      _cli: 'service_support',
      _prop: 'service_support',
      default: 'ASSET',
      conform: function(v) {
        if (v.length>18){ 
          return false;
        }
        return true;
      }
    },
    overwrite: {
      description: "overwrite existing files, if it exists?",
      required: true,
      _cli: 'overwrite',
      _yesno: 'n'
    }
  }//Ending properties.
};

cli.process(schema, process.argv, create_mbo);

function create_mbo(result) {
  
  var args = Object.assign({}, env.props, result);
  
  if(env.bool(result.dbc_script)){
    log.info("Creating DBC files");
    mbo.installTemplateMbo("mbos/dbc", env.addonDir(), args);
  }

  /**
   * Add service support on create 
   */
  if(!env.bool(result.add_service_support)){
    log.info("Will use the ASSET services");
    result.add_service_support = "ASSET";
  }else{
    log.info("Setting up "+result.service_name+" service.");
      //Will create the new Mbo service 
      mbo.installTemplateMbo("mbos/service", env.addonDir(), args);
  }
  
  mbo.installTemplateMbo("mbos/java", env.addonDir(), args);
}

