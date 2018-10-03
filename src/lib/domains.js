/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./logger');
var fs = require('fs-extra');
var templates = require('./templates');
var dbcscripts = require('./dbcscripts');
var env = require('./env');
var path = require('path');
var shell = require('shelljs');
var log = require("./logger");
var xmlUtil = require('./xml');
var DOMParser = new (require('xmldom')).DOMParser;

//for future uses.
var inquirer = require('inquirer');

var domainTypeMap = new Map();

domainTypeMap.set('SYNONYM', 'specify_synonym_domain');
domainTypeMap.set('ALN', 'specify_aln_domain');
domainTypeMap.set('NUMERIC', 'specify_numeric_domain');


var dm = module.exports = Object.create({});

/**
 * Install and verify the variable from Domain.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
dm.installTemplateDomain = function (template, dir, templateArgs) {
    dir = dir || env.addonDir() || '.';
    env.ensureDir(dir);

    //Create the property domain_id_lower to be used into the DBC file.
    if (!templateArgs.domain_id_lower) {
        templateArgs.domain_id_lower = templateArgs.domain_id.toLowerCase();
    }

    //create java package whenever is necessary
    if (!templateArgs.java_package_dir) {
        templateArgs.java_package_dir = path.join(...templateArgs.java_package.split('.'));
    }


    //Install template files.
    log.info("Install %s into %s", template, dir);
    var tdir = templates.resolveName(template);
    shell.ls("-R", tdir).forEach(function (f) {
        if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
            dm.installTemplateDomainFile(path.resolve(tdir, f), dir, f, templateArgs);
        }
    });

};

/**
 * Handle the Domain template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
dm.installTemplateDomainFile = function (template, outBaseDir, filePath, templateArgs) {
    var destPath = templates.render(filePath, templateArgs);

    // handle dbc scripts
    var script = dbcscripts.script(path.basename(template));
    if (script) {
        var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
        destPath = path.join(path.dirname(destPath), destScript);
        log.info("Installing DBC File for dm: %s", destPath);
        templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
        return;
    } //Ending DBC installing process for dm

    log.info("Domain structure installing at: %s", destPath);
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};

/**
 * Process the XML file during the template replacement process.
 * <synonymvalueinfo value="SPARE" maxvalue="SPARE" defaults="true" description="Spare" />
 */
dm.innerSynonymValueInfo = function (domainid, script_name, value, maxvalue, defaults, domain_description) {

    var xml_localtion = path.join(path.join(env.domainXml(), env.get('addon_id')), script_name);

    var document = DOMParser.parseFromString(xml_localtion);
    console.log(document);

    xmlUtil.update(xml_localtion, function (xml) {
        var el = xmlUtil.createElement(xml, "synonymvalueinfo", {
            value: value,
            maxvalue: maxvalue,
            defaults: defaults,
            description: domain_description
        });
        var changed = false;
        var count = xml.getElementsByTagName("specify_synonym_domain").length;

        for (var i = 0; i <= count; i++) {
            var node = xml.getElementsByTagName("specify_synonym_domain")[i];
            if (node) {
                if (node.getAttribute("domainid") == domainid) {
                    //Check if element was added.
                    xmlUtil.appendChild(xml, node, el, "  ", "\n  ");
                    changed = true;
                }
            }
        }
        if (!changed) {
            throw new Error("The domain " + domainid + " does not exists for the script " + script_name);
        }
        //finished
        return changed;
    });
    console.log("Synonym domain value configured!");
};

/**
 * Process the XML file during the template replacement process.
 * <alnvalueinfo value="SPARE" description="Spare" />
 */
dm.innerAlnValueInfo = function (domainid, script_name, value, domain_description) {

    var xml_localtion = path.join(path.join(env.domainXml(), env.get('addon_id')), script_name);

    var document = DOMParser.parseFromString(xml_localtion);
    console.log(document);

    xmlUtil.update(xml_localtion, function (xml) {
        var el = xmlUtil.createElement(xml, "alnvalueinfo", {
            value: value,
            description: domain_description
        });
        var changed = false;
        var count = xml.getElementsByTagName("specify_aln_domain").length;

        for (var i = 0; i <= count; i++) {
            var node = xml.getElementsByTagName("specify_aln_domain")[i];
            if (node) {
                if (node.getAttribute("domainid") == domainid) {
                    //Check if element was added.
                    xmlUtil.appendChild(xml, node, el, "  ", "\n  ");
                    changed = true;
                }
            }
        }
        if (!changed) {
            throw new Error("The domain " + domainid + " does not exists for the script " + script_name);
        }
        //finished
        return changed;
    });
    console.log("Aln domain value configured!");
};


/**
 * Process the XML file during the template replacement process.
 * <numericvalueinfo value="SPARE" description="Spare" />
 */
dm.innerNumericValueInfo = function (domainid, script_name, value, domain_description) {

    var xml_localtion = path.join(path.join(env.domainXml(), env.get('addon_id')), script_name);

    var document = DOMParser.parseFromString(xml_localtion);
    console.log(document);

    xmlUtil.update(xml_localtion, function (xml) {
        var el = xmlUtil.createElement(xml, "numericvalueinfo", {
            value: value,
            description: domain_description
        });
        var changed = false;
        var count = xml.getElementsByTagName("specify_numeric_domain").length;

        for (var i = 0; i <= count; i++) {
            var node = xml.getElementsByTagName("specify_numeric_domain")[i];
            if (node) {
                if (node.getAttribute("domainid") == domainid) {
                    //Check if element was added.
                    xmlUtil.appendChild(xml, node, el, "  ", "\n  ");
                    changed = true;
                }
            }
        }
        if (!changed) {
            throw new Error("The domain " + domainid + " does not exists for the script " + script_name);
        }
        //finished
        return changed;
    });

    console.log("Numeric domain value configured!");
};

/**
 * Find the domain inside a script in order to populate it within value's information. 
 * @param {*} domainid 
 * @param {*} script_name 
 */
dm.findDomainById = function (domainid, script_name) {

    var xml_localtion = path.join(path.join(env.domainXml(), env.get('addon_id')), script_name);

    var name = '';

    xmlUtil.update(xml_localtion, function (xml) {

        var count = xml.getElementsByTagName("statements")[0].childNodes.length;
        var found = false;

        for (var i = 0; i <= count; i++) {
            var node = xml.getElementsByTagName("statements")[0].childNodes[i];
            if (node && node.nodeName && node.nodeName.startsWith('specify_')) {
                if (node) {
                    if (node.getAttribute("domainid") && node.getAttribute("domainid") == domainid) {
                        //Check if element was added.
                        found = true;
                        console.log("Element found: " + node);
                        name = node.nodeName;
                    }
                }
            }
        }
        // if (!found) {
        //     throw new Error("Element within the domainid = " + domainid + " was not found into the " + script_name + " script.");
        // }
    });

    return name;
};



/**
 * 
 * It should be use in a sync call from inquirer.js module. 
 * The inquirer module is a iterative way to read an get information from a CLI. 
 * It should be combined with commander.js module to incorporate sub-commands (nested commands) when 
 * certain values are complex or compound. 
 * @deprecated
 */
dm.readDomainValues = function () {
    //var array = new Array (2);

    for (var i = 0; i < 2; i++) {
        console.log('Read the domain\'s values.');
        var questions = [
            {
                type: "input",
                name: "value",
                message: "Domain value."
            },
            {
                type: "input",
                name: "internal",
                message: "Internal value"
            },
            {
                type: "confirm",
                name: "default",
                message: "Is default value?"
            }
        ];

        //Read parameters
        inquirer.prompt(questions).then(function (answers) {
            console.log(answers);
        });
    }
    return true;
};

/**
 *  <specify_synonym_domain domainid="{{domain_id}}" maxtype="{{domain_maxtype}}" length="{{domain_length}}" description="{{domain_description}}" overwrite="{{domain_overwrite}}">

 * @param {*} domainid 
 * @param {*} script_name 
 * @param {*} value 
 * @param {*} maxvalue 
 * @param {*} defaults 
 * @param {*} domain_description 
 */
dm.createDomainStructure = function (domain_strucutre, domainid, script_name, maxtype, description, length, overwrite) {

    var xml_localtion = path.join(path.join(env.domainXml(), env.get('addon_id')), script_name + '.dbc');

    //var document = DOMParser.parseFromString(xml_localtion);
    //console.log(document);

    var domain_type = domainTypeMap.get(domain_strucutre.toUpperCase());

    xmlUtil.update(xml_localtion, function (xml) {
        var el = xmlUtil.createElement(xml, domain_type, {
            domainid: domainid,
            maxtype: maxtype,
            length: length,
            description: description,
            overwrite: overwrite
        });
        //var changed = false;
        xmlUtil.appendChild(xml, xml.getElementsByTagName("statements")[0], el, "  ", "\n  ");

        // if (!changed) {
        //     throw new Error("Was not able to add " + domainid + " to the script: " + script_name);
        // }
        //finished
        return true;
    });
    console.log(domain_strucutre + " domain structure configured at "+script_name);
};

