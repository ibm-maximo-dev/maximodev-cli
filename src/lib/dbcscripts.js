var log = require('./logger');
var fs = require('fs');
var templates = require('./templates');
var env = require('./env');
var path = require('path');

var dbcscripts = module.exports = Object.create({});

/**
 * Find the Next Script name in the directory
 *
 * @param dir
 */
dbcscripts.nextScript = function(dir) {
  return dbcscripts.nextScriptName(dbcscripts.lastScript(dir))
};

/**
 * Given current name, return the next script name
 */
dbcscripts.nextScriptName = function(curName) {
  if (!curName) {
    // TODO: We need to define a new script using product xml
    return "V1000_01.dbc";
  } else {
    var script = dbcscripts.script(curName);
    script.number++;
    return dbcscripts.format(script);
  }
};

/**
 * Return the last script in the directory
 * @param dir
 * @returns {string} script filename without path
 */
dbcscripts.lastScript = function(dir) {
  dir=dir||env.scriptDir();
  log.trace("last Script for Dir " + dir);

  if (!fs.existsSync(dir)) {
    log.error("Dir does exist: %s", dir);
    return null;
  }

  var files = fs.readdirSync(dir).filter(e => (
    e.endsWith(".dbc") || e.endsWith(".msg") || e.endsWith(".csv") || e.endsWith(".mxs") || e.endsWith(".msg")
    || e.endsWith(".sql")
  ));
  files.sort(dbcscripts.compare);
  log.trace(files);
  if (files.length===0) return null;
  return files[files.length-1];
};

/**
 * Creates a new empty script in the script dir with the give name.  If name is null then it will attempt to find the
 * next script in sequence.
 * @param args
 * @param outName
 * @param outDir
 */
dbcscripts.createNewScriptInDir = function(args, outName, outDir) {
  var tpl = templates.resolveName("dbc/new.dbc");

  // if not set, then use defaults
  outDir=outDir||env.scriptDir();
  outName=outName||dbcscripts.nextScript(outDir);

  var outFile = path.join(outDir, outName);

  if (fs.existsSync(outFile)) {
    log.error("DBC file already exists: %s", outFile);
    return;
  }

  args = args || {};
  args.author = args.author || env.props.author || 'unknown';
  args.name = args.name || outName;
  templates.renderToFile(tpl, args, outFile);
  log.info("Created %s/%s", outDir, outName);
};

const SCRIPT_REGEX = new RegExp("(HF|V)([0-9]+)_([0-9]+)\\.([a-zA-Z]+)");
/**
 * Returns script object as {fullname: prefix:, version:, number:, ext:}
 * for a given scriptname like, 'V7601_03.dbc'
 * @param str
 */
dbcscripts.script = function(str) {
  if (str) {
    var match = SCRIPT_REGEX.exec(str);
    if (match) {
      return {
        fullname: str,
        prefix: match[1],
        version: match[2],
        number: parseInt(match[3]),
        ext: match[4]
      };
    }
  }
  return null;
};

/**
 * return true if the scriptname is valid
 * @param s
 */
dbcscripts.isValidScriptName = function(s) {
  return dbcscripts.script(s)!=null;
};

/**
 * Will compare 2 scripts accounting for HF or V and the the script version.  This will ensure that scripts
 * that are in the same version but some are HF and some are V, that the HF scripts will come last.
 *
 * @param s1
 * @param s2
 * @returns {number}
 */
dbcscripts.compare = function(s1, s2) {
  var e1=_compareableScript(s1);
  var e2=_compareableScript(s2);
  if ( (e1.startsWith('V') && e2.startsWith("V")) || (e1.startsWith('HF') && e2.startsWith("HF"))) {
    return e1.localeCompare(e2);
  } else if (e1.startsWith("HF")) {
    var comp = _compareableScript(s1,true).localeCompare(_compareableScript(s2,true));
    if (comp==0) {
      return 1;
    }
    return comp;
  } else {
    var comp = _compareableScript(s1,true).localeCompare(_compareableScript(s2,true));
    if (comp==0) {
      return -1;
    }
    return comp;
  }
};

/**
 * Will format a script object into a script string
 * @param script
 * @returns {string}
 */
dbcscripts.format = function(script) {
  return script.prefix + script.version + "_" + _padNumber(script.number, 2) + "." + script.ext;
};

/// --- Private Functions

function _compareableScript(s, versionOnly) {
  var script = dbcscripts.script(s);
  if (versionOnly) {
    return _padVersion(script.version);
  } else {
    return script.prefix + _padVersion(script.version) + "_" + _padNumber(script.number, 5);
  }
}

function _padVersion(v) {
  if (v.length===4) {
    return v.substring(0,3) + "0" + v.substring(3);
  }
  return v;
}

function _padNumber(n, padding) {
  return (""+n).padStart(padding,"0");
}
