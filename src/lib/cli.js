var env = require('./env');
var prompt = require('prompt');
var program = require('commander');

var cli = module.exports = Object.create({});
cli.program=program;
cli.prompt=prompt;

/**
 * Given the schema, build the command line and then prompt the user.  The callback will be pased an object of name
 * value pair elements as parsed from the command line and/or prompted from the user.
 *
 * @param schema standard 'prompt' scheme with some cli enhancements
 * @param argv command arguments
 * @param cb callback function
 */
cli.process = function(schema, argv, cb) {
  var prog = program
    .version(schema.version)
    .description(schema.description);

  // upgrade the prompt and parse args
  prog = updateCommandArgsFromSchema(schema, prog);
  cli.program=prog;
  prog.parse(argv);

  // upgrade prompts from the command line args
  updateSchemaFromPromptResults(schema, prog, prompt);

  if (process.env['MAXIMO_CLI_NO_PROMPT']) {
    cb(buildResultFromCli(prog,schema));
  } else {
    // prompt the user
    prompt.message = "";
    prompt.start();
    prompt.get(schema, function (err, result) {
      printCommandLine(schema, program, result);
      cb(result);
    });
  }
};

function buildResultFromCli(prog, schema) {
  var result = {};

  Object.keys(schema.properties).forEach(function(e) {
    var o = schema.properties[e];
    if (o._cli) {
      // add cli option to prog
      var val = prog[o._cli];
      if (o._yesno) {
        val = prog[e]?'y':'n';
      }
      result[e]=val;
    }
  });

  console.log("cmdline result: ", result);

  return result;
}

/**
 * Build command line args from schema
 *
 * @param schema
 * @param prog program instance
 * @returns {object} prog
 */
function updateCommandArgsFromSchema(schema, prog) {
  Object.keys(schema.properties).forEach(function(e) {
    var o = schema.properties[e];
    if (o._cli) {
      // add cli option to prog
      var option = '--' + o._cli;
      var argValue = "";
      if (!o._yesno) {
        if (o._cli_arg_value) {
          if (!o._cli_arg_value.startsWith('<') && !o._cli_arg_value.startsWith('[')) {
            argValue = '<' + o._cli_arg_value + ">";
          } else {
            argValue = o._cli_arg_value;
          }
        } else {
          argValue = "<VALUE>";
        }
        if (!argValue.startsWith(' ')) argValue = (' ' + argValue);
      }
      var desc = o._cli_description || o.description || o.message || "";
      prog =prog.option(option +  argValue, desc);
    }
  });
  return prog;
}

/**
 * given the prompt schema update its default values from the _cli and _prop fields, if they exist
 */
function updateSchemaFromPromptResults(schema, program, prompt) {
  Object.keys(schema.properties).forEach(function(e) {
    var o = schema.properties[e];
    if (o._yesno) {
      o = yes_no(o, o._yesno);
    }

    var def = null;

    // check for default from command line
    if (o._cli) {
      def = program[(o._cli)];
      // adjust for boolean commandline args
      if (def===true) def = 'y';
      if (def) {
        o.ask = function() {
          // don't prompt, but conform it
          if (o.conform) {o.conform(def)}
          return false;
        }
      }
    }

    // no default from command line, check the props
    if (!def && o._prop) {
      def = env.get(o._prop);
    }

    // if we have a default, then replace the one in the configuration
    if (def) {
      o.default=def;
    }

    if (o._depends) {
      var dep = o._depends;
      o.ask = function() {
        if (!prompt.history(dep)) {
          throw Error('Cannot do depends, since ' + dep + ' is not configured in the prompt schema.  Verify spelling.');
        }
        // todo: we are always assuming depends relies on boolean properites
        return env.bool(prompt.history(dep).value);
      };
    }
  });

  return schema;
}


function yes_no(props, def) {
  if (def===true) def='y';
  if (def===false) def='n';
  if (def===undefined || def===null) def='n';
  def=def.toLowerCase().substring(0,1);
  props.message=props.message||props.description;
  props.validator = /y[es]*|n[o]?/;
  props.warning = "Must be yes or no, or y or n";
  props.default = props.default || def;
  return props;
}


function printCommandLine(schema, program, result) {
  if (!process.env.DEBUG_ARGS) return;

  var cmd = "";

  Object.keys(schema.properties).forEach(function(e) {
    var o = schema.properties[e];
    if (o._cli) {
      if (!o._yesno) {
        cmd = cmd + '--' + o._cli;
        cmd = cmd + ' "' + result[e] + '" ';
      } else {
        if (env.bool(result[e])) {
          cmd = cmd + '--' + o._cli;
        }
      }
      cmd += " ";
    }
  });

  console.log("Expanded commandline args were...");
  console.log(cmd);
}
