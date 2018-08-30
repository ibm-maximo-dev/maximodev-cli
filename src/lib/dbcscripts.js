/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var fs = require('fs-extra');

var path = require('path');
var shell = require('shelljs');
var util = require('util');

var log = require('./logger');
var templates = require('./templates');
var env = require('./env');
var xml = require('./xml');

const xmlescape = require("xml-escape");


var dbcscripts = module.exports = Object.create({});

/**
 * Find the Next Script name in the directory and return the script name
 * use nextScriptFile to return the full path of the script.
 *
 * @param dir
 */
dbcscripts.nextScript = function (dir, ext) {
  var script = dbcscripts.nextScriptName(dbcscripts.lastScript(dir));
  if (script && ext) {
    var els = dbcscripts.script(script);
    if (ext.startsWith('.')) ext = ext.substring(1);
    els.ext = ext;
    script = dbcscripts.format(els);
  }
  return script;
};

dbcscripts.nextScriptFile = function (dir, ext) {
  return path.resolve(dir, dbcscripts.nextScript(dir, ext));
};


/**
 * Given current name, return the next script name
 */
dbcscripts.nextScriptName = function (curName) {
  if (!curName) {
    // TODO: We need to define a new script using product xm

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
dbcscripts.lastScript = function (dir) {
  dir = dir || env.scriptDir();

  if (!fs.existsSync(dir)) {
    log.error("Dir does exist: %s", dir);
    return null;
  }

  var files = fs.readdirSync(dir).filter(e => (
    !e.startsWith('.') && (
      e.endsWith(".dbc") || e.endsWith(".msg") || e.endsWith(".csv") || e.endsWith(".mxs") || e.endsWith(".msg")
      || e.endsWith(".sql") || e.endsWith(".dbc.in"))
  ));
  files.sort(dbcscripts.compare);
  log.trace(files);
  if (files.length === 0) return null;
  return files[files.length - 1];
};

/**
 * Given the script/scriptname, resolve the script and then run it
 * @param script
 */
dbcscripts.runScript = function (script) {
  var dbc = null;
  if (fs.existsSync(script)) {
    dbc = path.resolve(script);
  } else if (fs.existsSync(path.join(env.scriptDir(), script))) {
    dbc = path.resolve(path.join(env.scriptDir(), script));
  } else {
    log.error("Invalid Script: %s", script);
    process.exit(1);
  }

  // TODO: what if we get a script without an ext?  Should we resolve it?

  log.info("Processing Script: %s", dbc);

  // need to copy the script to the maximo home, to a tmp product dir, and then run the script from there
  var productDirName = 'zzztmp'; // this is a temp script dir that we will use to load the file
  var productDir = path.resolve(path.join(env.maximoToolsHome(), 'en', productDirName));
  var scriptName = path.basename(dbc);
  shell.mkdir("-p", productDir);
  shell.cp(dbc, productDir);
  log.debug("Copied DBC %s to %s", scriptName, productDir);

  var handler = function (cmd, proc) {
    var stderr = proc.stderr;
    var stdout = proc.stdout;

    if ((stderr && stderr.match(new RegExp("Error"))) || (stdout && stdout.match(new RegExp("COMPLETED WITH ERROR")))) {
      console.log("\n\n");
      log.error("The script failed to run!!!");

      var out = stdout;
      if (out) {
        var re = new RegExp('Log file: (.*)');
        var r = out.match(re);
        if (r) {
          var logFile = path.resolve(path.join(env.maximoToolsHome(), 'log', r[1]));
          if (fs.existsSync(logFile)) {
            log.info("DBC Log File: %s", logFile);
            env.askYesNo('Do you want to view the log file?', 'y', function (response) {
              if (response) {
                console.log("\n\n");
                console.log(fs.readFileSync(logFile).toString());
              }
            });
          }
        }
      }
    }
  };

  // the script name should just be the base script name without ext
  scriptName = scriptName.slice(0, -4);

  env.runMaximoTool("psdi.tools.RunScriptFile", util.format("-c%s -f%s", productDirName, scriptName), null, handler, handler);
};


/**
 * Creates a new empty script in the script dir with the give name.  If name is null then it will attempt to find the
 * next script in sequence.
 * @param args
 * @param outName
 * @param outDir
 */
dbcscripts.createNewScriptInDir = function (args, outName, outDir) {
  var tpl = templates.resolveName("dbc/new.dbc");

  // if not set, then use defaults
  outDir = outDir || env.scriptDir();
  outName = outName || dbcscripts.nextScript(outDir);

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
dbcscripts.script = function (str) {
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
 * Return the MXS delta script that is used for this addon/version.
 * @param dir
 * @returns {*|string}
 */
dbcscripts.getMxsScript = function (dir) {
  dir = dir || env.scriptDir();

  // figure out where we need to write to script delta
  // in most cases, script deltas are written to the 02 dbc file
  var nextScript = dbcscripts.nextScript(dir, 'mxs');
  var script_parts = dbcscripts.script(nextScript);
  script_parts.number = 2;

  var script = dbcscripts.format(script_parts);
  return path.join(dir, script);

};

/**
 * return true if the scriptname is valid
 * @param s
 */
dbcscripts.isValidScriptName = function (s) {
  return dbcscripts.script(s) != null;
};

/**
 * Will compare 2 scripts accounting for HF or V and the the script version.  This will ensure that scripts
 * that are in the same version but some are HF and some are V, that the HF scripts will come last.
 *
 * @param s1
 * @param s2
 * @returns {number}
 */
dbcscripts.compare = function (s1, s2) {
  var e1 = _compareableScript(s1);
  var e2 = _compareableScript(s2);
  if ((e1.startsWith('V') && e2.startsWith("V")) || (e1.startsWith('HF') && e2.startsWith("HF"))) {
    return e1.localeCompare(e2);
  } else if (e1.startsWith("HF")) {
    var comp = _compareableScript(s1, true).localeCompare(_compareableScript(s2, true));
    if (comp == 0) {
      return 1;
    }
    return comp;
  } else {
    var comp = _compareableScript(s1, true).localeCompare(_compareableScript(s2, true));
    if (comp == 0) {
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
dbcscripts.format = function (script) {
  return script.prefix + script.version + "_" + _padNumber(script.number, 2) + "." + script.ext;
};


dbcscripts._buildScriptDir = function () {
  var addon_in = env.get('addon_id');
  var dir = env.ensureDir(path.join('dist/tools/maximo/en/', "" + addon_in));
  console.log("Test %", dir);
  return dir;
}


dbcscripts.listBuildScripts = function (extension) {
  shell.ls("-R", dbcscripts._buildScriptDir()).forEach(function (f) {
    console.log("File: %s", f);
  });
}


dbcscripts.getScriptData = function (script_name) {
  var script = script_name.split('.');

  var script = {
    prefix: script[0].substring(0, 1),
    version: script[0].substring(1, 5),
    update: script[0].substring(6, script[0].length)
  };
  return script;
}

dbcscripts.mergeScript = function (script_base) {
  //Join script file path
  var xmlPath = path.join(dbcscripts._buildScriptDir(), "" + script_base);
  console.log("Reading DBC at " + xmlPath);

  //Reading XML file
  var doc = xml.getDocFromFile(xmlPath);

  //Check element exists
  if (xml.hasNode(doc, 'statements', function (node) {
    //console.log("Node:" + node);

    var b_script = dbcscripts.getScriptData(script_base);

    var scripts;
    shell.ls("-R", dbcscripts._buildScriptDir()).forEach(function (f) {

      if (f.endsWith('dbc')) {
        var n_script = dbcscripts.getScriptData(f);

        if ((b_script.version == n_script.version) && (b_script.update < n_script.update)) {
          console.log("Including: %s", f);

          //This method only accept string, needs to update to read the file 
          var xmlPathToInclude = path.join(dbcscripts._buildScriptDir(), "" + f);
          var docToInclude = xml.getDocFromFile(xmlPathToInclude);
          if (xml.hasNode(docToInclude, 'statements', function (nodeToCopy) {
            for (var i = 0; i < nodeToCopy.childNodes.length; ++i) {

              var n_node = nodeToCopy.childNodes[i];

              /**
               * doc - Base script where the merge will be done
               * node - Statement element to add elements from other scripts
               */
              //node.appendChild(doc.createTextNode(xml.convertTextXMLtoJSON(nodeToCopy.childNodes[i])));
              if (n_node.nodeName.toString() != "#text") {
                console.log("copy %s to %s script.", n_node.nodeName, f);
                //node.appendChild(n_node);
                xml.appendChild(doc, doc.getElementsByTagName("statements")[0], n_node, "  ", "\n  ");
                //node.appendChild(nodeToCopy.childNodes[i]);
              }
              //node.importNode(nodeToCopy.childNodes[i],false);
              //Save file now to ensure the process to be save
              xml.updateDoc(doc, xmlPath);

            }
            console.log("File %s merged.", f);

            var d_xml = path.join(dbcscripts._buildScriptDir(), "" + f);
            //Remove unecessary files. 
            if (fs.existsSync(d_xml)) {
              fs.removeSync(d_xml);
            }
          }));
        }//End check script
      }
    });

  }));
  console.log("Merge all scripts into %s", script_base);
  return false;
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
  if (v.length === 4) {
    return v.substring(0, 3) + "0" + v.substring(3);
  }
  return v;
}

function _padNumber(n, padding) {
  return ("" + n).padStart(padding, "0");
}
