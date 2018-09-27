#! /usr/bin/env node

var env = require('./lib/env');
var cli = require('./lib/cli');
var dbc = require('./lib/dbcscripts');
var dm = require('./lib/domains');
var maxTypeList = require('./lib/domain_values/maxtype_list');
var structureList = require('./lib/domain_values/structures_list');

var next_script = dbc.nextScript();


var schema = {
  _version: '0.0.1',
  _description: 'Create a Synonym domain',
  properties: {
    domain_id: {
      description: "Domain's ID",
      pattern: /^[A-Z0-9]+$/,
      message: 'It must only contain letters and numbers in capital letter',
      require: true,
      _cli: 'domain_id',
      default: 'DOMAIN' + Date.now()
    },
    domain_structure: {
      description: 'Domain\'s structure definition',
      pattern: /^.*\b(ALN|SYNONYM|NUMERIC)\b.*$/,
      require: true,
      messsage: 'Provide a brief description about the domain purpose.',
      _cli: 'domain_structure',
      default: 'SYNONYM',
      ask: function () {
        structureList();
        return true;
      }
    },
    domain_description: {
      description: 'Domain\'s description',
      require: true,
      messsage: 'Provide a brief description about the domain purpose.',
      _cli: 'domain_description',
      default: 'maximodev-cli\'s domain'
    },
    domain_maxtype: {
      depends: 'domain_list_maxtype',
      description: "Provide the domain maxtype",
      pattern: /^.*\b(ALN|DECIMAL|INTEGER|SMALLINT|UPPER)\b.*$/,
      message: 'Only maximo MAXTYPEs are available (i.e. ALN|DECIMAL|INTEGER|SMALLINT|UPPER)',
      default: 'ALN',
      _cli: 'doamin_maxtype',
      require: true,
      ask: function () {
        maxTypeList();
        return true;
      }
    },
    domain_overwrite: {
      description: "Overwrite a existent domain",
      required: true,
      _cli: 'domain_overwrite',
      _yesno: true,
      default: 'y'
    },
    script_name: {
      description: "DBC Script to insert the synonym domain.",
      pattern: /^[a-zA-Z_0-9]+$/,
      message: 'Must only contain letters, numbers, spaces and underscores',
      required: true,
      _cli: 'script_name',
      _cli_arg_value: '<NAME>',
      default: next_script.substring(0, next_script.length - 4)
    },
    domain_length: {
      description: "Overwrite a existent domain",
      type: 'integer',
      required: true,
      _cli: 'domain_length',
      default: 25
    }
  }//Ending properties.
};

cli.process(schema, process.argv, create_domains);

function create_domains(result) {

  var args = Object.assign({}, env.props, result);

  console.log(result);

  result.domain_overwrite = (result.domain_overwrite == 'y') ? true : false;

  var structure = result.domain_structure.toLowerCase();

  //Use templates 
  if (next_script == (result.script_name + '.dbc')) {
    dm.installTemplateDomain("domain/" + structure, env.addonDir(), args)
  }
  else {  //add to an existent 
    dm.createDomainStructure(structure,
      result.domain_id,
      result.script_name,
      result.domain_maxtype,
      result.domain_description,
      result.domain_length,
      result.domain_overwrite)
  }

  // expected output: "Success!"
  console.log('Finishes temaplate copy');
};