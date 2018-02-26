var props = require('properties-parser');
var fs = require('fs-extra');
var path = require('path');
var util = require('util');
var dateformat = require('dateformat');
var log = require('./logger');

var env = module.exports = Object.create({});

env.props = {};

/**
 * Returns env value of 'key' first from the OS environment, and if not there,
 * then it will check the addon.properties.
 *
 * @param key
 * @param defValue
 */
env.get = function(key, defValue) {
  if (!key) return null;
  var val = process.env[key.toUpperCase()];
  if (val===undefined) {
    val = env.props[key];
  }
  if (val === undefined) val=defValue;
  return val;
};

env.reload = function(propFile) {
  var addOnPropsFile = env.get("MAXIMO_ADDON_PROPERTIES", "./addon.properties");
  if (propFile) {
    addOnPropsFile = propFile;
  }

  if (fs.existsSync(addOnPropsFile)) {
    log.info("Loading addon properties: %s", addOnPropsFile);
    var p = props.read(addOnPropsFile);
    if (p) env.props=p;
    env.propfile=path.resolve(addOnPropsFile);
  }

  // set the full path to our add_on dir based on the location of the addon.properties
  // TODO: validate
  env.props.addon_dir = path.resolve(path.dirname(addOnPropsFile));

  env.PROJECT_ROOT=env.addonDir();
};

/**
 * Returns the configured addon id for this script.
 */
env.addonId = function() {
  return env.get('addon_id', 'bpaaa_myproduct');
};

/**
 * Return the addon's root directory.
 *
 * @param extraPath
 * @returns {string} full path to addon directory
 */
env.addonDir = function(extraPath) {
  var base = env.get('addon_dir','.');
  if (extraPath) base = path.join(base, extraPath);
  var base = path.resolve(base);
  return env.ensureDir(base);
};

env.REL_DIR_MAXIMO_APPLICATIONS = 'applications/maximo';
env.REL_DIR_BUSINESS_OBJECTS = path.join(env.REL_DIR_MAXIMO_APPLICATIONS, 'businessobjects');

env.addonBusinessObjectsDir = function(extraPath) {
  var base = env.addonDir(env.REL_DIR_BUSINESS_OBJECTS);
  if (extraPath) base = path.join(base, extraPath);
  return env.ensureDir(base);
};

/**
 * Return the script directory for this addon
 * @param {string} full path to script directory
 */
env.scriptDir = function(id) {
  return env.ensureDir(path.resolve(env.get('addon_script_dir', path.join(env.addonDir('./tools/maximo/en/'), id||env.addonId()))));
};

/**
 * Return the product xml file for this addon
 * @param {string} full path to the product xml
 */
env.productXml = function(id) {
  return env.ensureParent(path.resolve(env.get('addon_product_xml', path.join(env.addonDir('./applications/maximo/properties/product/'), (id||env.addonId())+".xml"))));
};

env.productXmlIn = function(id) {
  return env.ensureParent(path.resolve(env.get('addon_product_xml', path.join(env.addonDir('./applications/maximo/properties/product/'), (id||env.addonId())+".xml.in"))));
};

/**
 * Ensure the directory exists, and return it.
 * @param d
 * @returns {string}
 */
env.ensureDir = function(d) {
  fs.ensureDirSync(d);
  return d;
};

/**
 * Ensures a directory relative to the addon dir exists
 * @param d
 * @returns {string}
 */
env.ensureAddonDir = function(d) {
  fs.ensureDirSync(env.addonDir(d));
  return d;
};

/**
 * Ensure the parent directory exists for the given file and return the file
 * @param f
 * @returns {string}
 */
env.ensureParent = function(f) {
  fs.ensureDirSync(path.dirname(f));
  return f;
};

env.buildNumber = function() {
  var num = env.get('build_number');
  if (!num) {
    num = dateformat(new Date(), "yyyymmdd-hhMM");
  }
  return num;
};

/**
 * Template location for the CLI tools
 * @type {string}
 */
env.TOOLS_DIR=path.resolve(__dirname + "/../../");

env.initProperties = function(file, src) {
  var props = "";
  props += util.format("%s=%s\n", 'author', src.author);
  props += util.format("%s=%s\n", 'addon_prefix', src.addon_prefix);
  props += util.format("%s=%s\n", 'addon_id', src.addon_id);
  props += util.format("%s=%s\n", 'addon_description', src.addon_description);
  props += util.format("%s=%s\n", 'addon_version', src.addon_version);
  if (src.maximo_home) {
    if (!env.isValidMaximoHome(src.maximo_home)) {
      log.error("Not a valid maximo home: %s", src.maximo_home);
    } else {
      props += util.format("%s=%s\n", 'maximo_home', path.resolve(src.maximo_home));
    }
  }
  fs.writeFileSync(file, props);
  log.info("saved addon.properties");
};


env.saveProperties = function(possibleValues, toGlobal) {
  var props = {};
  var keys = ['author','addon_prefix', 'addon_id', 'addon_description', 'addon_version', 'maximo_home'];
  keys.forEach(function(k) {
    props[k] = possibleValues[k] || env.get(k);
  });

  if (toGlobal) {
    log.error('saving to global is not implemented, yet');
  } else {
    env.initProperties(env.propfile, props);
  }
};


/**
 * given the prompt schema update its default values from the _cli and _prop fields, if they exist
 */
env.updateSchema = function(schema, program, prompt) {
  Object.keys(schema.properties).forEach(function(e) {
    var o = schema.properties[e];
    if (o._cli) {
      o.default = program[(o._cli)] || o.default;
      // adjust for boolean commandline args
      if (o.default===true) o.default = 'y';
    }
    if (!o.default && o._prop) {
      o.default = env.get(o._prop);
    }

    if (o._depends) {
      var dep = o._depends;
      o.ask = function() {
        if (!prompt.history(dep)) {
          throw Error('Cannot do depends, since ' + dep + ' is not configured in the prompt schema.  Verify spelling.');
        }
        // todo: we are always assuming depends relies on boolean properites
        return prompt.history(dep).value.toLowerCase().startsWith('y');
      };
    }
  });

  return schema;
};

/**
 * Return true if the value is y, yes, or true.  Otherwise false.
 * @param val
 */
env.bool = function(val) {
  if (!val) return false;
  if (val===true) return true;
  val=val.toLowerCase();
  return val.startsWith('y');
};

/**
 * Returns the maximo home directory, or throws an error if it is not set.
 *
 * @returns {string} Maximo Home directory
 */
env.maximoHome = function() {
  var home = env.get('maximo_home', null);
  if (!home) throw Error('maximo_home is not set in the environment or addon.properties');
  return path.resolve(home);
};

/**
 * transforms the given path(s) into paths that exist in the Maximo deployment area.
 * @param {string|array} path(s)
 */
env.resolveMaximoPath =  function(pathArr) {
  var home = env.maximoHome();

  if (Array.isArray(pathArr)) {
    var arr = [];
    pathArr.forEach(function(e){
      arr.push(env.resolveMaximoPath(e));
    });
    return arr;
  } else {
    return path.resolve(path.join(home), pathArr);
  }
};

/**
 * Returns the maximo Tools home directory.
 */
env.maximoToolsHome = function() {
  return path.resolve(path.join(env.maximoHome(), 'tools/maximo/'));
};

/**
 * returns true if the given directory is a valid maximo home directory
 *
 * @param dir
 * @returns {*}
 */
env.isValidMaximoHome = function(dir) {
  return fs.existsSync(dir) && fs.existsSync(path.join(dir, 'tools/maximo/en/script/'));
};

// reload an initialize the env
env.reload();