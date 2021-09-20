#! /usr/bin/env node

var env = require('./lib/env');
var cli = require('./lib/cli');
var dbc = require('./lib/dbcscripts');
var dm = require('./lib/domains');

var lastscript = dbc.lastScript(env.scriptDir());

//Numeric domain values
var schema = {
  _version: '0.0.1',
  _description: 'Create a Synonym domain',
  properties: {
    value_domainid: {
      description: 'Domain id for add values',
      pattern: /^[A-Z0-9]*$/,
      require: true,
      messsage: 'The domain id should be unique and only contains capital letters and numbers.',
      _cli: 'value_domainid',
      default: 'NUM'
    },
    value_scriptname: {
      description: 'Script name that contains the domain you want to add values',
      pattern: /^[A-Z0-9_.a-z]*$/,
      require: true,
      message: 'Please follow the standards involved on script name creation to provide the script\'s name',
      _cli: 'value_scriptname',
      default: lastscript
    },
    value_domainvalue: {
      description: 'Provide the value of this domain',
      pattern: /^[A-Z0-9_.a-z]*$/,
      require: true,
      message: 'This value MUST BE in capital letters and numbers.',
      _cli: 'value_domainvalue',
      default: 'VALUE'
    },
    value_description: {
      description: 'Value\'s purpose description',
      require: true,
      message: 'Please insert a brief descriptions about the value meaning.',
      _cli: 'value_description',
      default: 'New value from masmanagedev-cli'
    },
  }//Ending properties.
};


cli.process(schema, process.argv, add_domain_values);


function add_domain_values(result) {

  //var args = Object.assign({}, env.props, result);

  console.log(result);

  //Populate variables
  var domainid = result.value_domainid;
  var script_name = result.value_scriptname;
  var value = result.value_domainvalue;
  var value_description = result.value_description;

  // Add element to the specific domain

  dm.innerNumericValueInfo(domainid, script_name, value, value_description);

};

