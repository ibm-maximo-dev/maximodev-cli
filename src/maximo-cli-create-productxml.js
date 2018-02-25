var productxml = require('./lib/productxml');
var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');

var fs = require('fs-extra');

var schema = {
  _version: '0.0.1',
  _description: 'Maximo Create Product xml',
  properties: {
    addon_prefix: {
      description: "Addon Prefix",
      pattern: /^[a-zA-Z]+$/,
      message: 'Must only contain letters, and should not be no longer than 5 characters',
      required: true,
      _cli: 'addon_prefix',
      _cli_arg_value: '<PREFIX>',
      _prop: 'addon_prefix',
      default: 'BPAAA',
      conform: function(v) {
        if (v.length>5) return false;
        // set default addon name based on the prefix
        schema.properties.addon_id.default = v.toLowerCase()+"_prod1";
        schema.properties.author.default = v.toLowerCase();
        return true;
      }
    },
    addon_id: {
      description: "Addon Name",
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, and underscores',
      required: true,
      _cli: 'addon_name',
      conform: function(v) {
        schema.properties.product_xml.default = env.productXml(v.toLowerCase());
        return true;
      }
    },
    author: {
      description: "Addon Author",
      required: false,
      _cli: 'author',
    },
    addon_description: {
      description: "Addon Description",
      required: false,
      _cli: 'desc'
    },
    addon_version: {
      description: "Addon Version",
      required: true,
      _cli: 'ver',
      default: '1.0.0.0'
    },
    product_xml: {
      description: "full path to product xml file",
      required: true,
      _cli: 'xml'
    },
    overwrite: {
      description: "overwrite existing file, if it exists?",
      required: true,
      _cli: 'overwrite',
      _yesno: 'n'
    }

  }
};

cli.process(schema, process.argv, function(result) {
  create_product_xml(result, env.bool(result.overwrite));
});

function create_product_xml(result, overwrite) {
  // we generate a templated product xml file
  if (!result.product_xml.endsWith(".in")) result.product_xml += '.in';

  if (env.bool(overwrite) || env.bool(result.overwrite)) {
    if (fs.existsSync(result.product_xml)) {
      log.info("removing existing product xml: %s", result.product_xml);
      fs.removeSync(result.product_xml);
    }
  }

  productxml.newProductXml(result, result.product_xml);
  productxml.updateVersion(result.product_xml, env.scriptDir(result.addon_id));
}
