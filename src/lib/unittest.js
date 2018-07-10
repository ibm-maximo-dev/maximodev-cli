/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./logger');
var fs = require('fs-extra');
var templates = require('./templates');
var dbcscripts = require('./dbcscripts');
var xmlutil = require('./xml');

var env = require('./env');
var util = require('util');
var shell = require('shelljs');
var path = require('path');
var xml2js = require('xml2js');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

var unittest = module.exports = Object.create({});

/**
 * Install and verify the variable from UTT.
 * @param {*} template Template's source folder.
 * @param {*} dir Target directory.
 * @param {*} templateArgs Template's arguments.
 */
unittest.installTemplateUTT = function (template, dir, templateArgs) {

    //Set test name to lowercase if not
    if (templateArgs.test_name) {
        templateArgs.test_name_lower = templateArgs.test_name.toLowerCase();
    }

    //Split out the package name checking the package name
    if (templateArgs.test_package_dir) {
        templateArgs.test_package_dir = path.join(...templateArgs.test_package_dir.split('.'));
    }

    dir = dir || env.addonDir() || '.';
    env.ensureDir(dir);
    //Shadowing ?
    this.templateArgs = templateArgs;

    log.info("Install %s into %s", template, dir);
    var tdir = templates.resolveName(template);
    shell.ls("-R", tdir).forEach(function (f) {
        if (!fs.lstatSync(path.join(tdir, f)).isDirectory()) {
            //Find the dbc into the condition UI script
            unittest.installTemplateUTTFile(path.resolve(tdir, f), dir, f, templateArgs);
        }
    });
};
/**
 * Handle the unittest template files. 
 * @param {*} template Source folder of template files.
 * @param {*} outBaseDir Output folder name.
 * @param {*} filePath Full path of rendered files.
 * @param {*} templateArgs Template arguments.
 */
unittest.installTemplateUTTFile = function (template, outBaseDir, filePath, templateArgs) {
    var destPath = templates.render(filePath, templateArgs);

    // handle dbc scripts
    var script = dbcscripts.script(path.basename(template));
    if (script) {
        var destScript = dbcscripts.nextScript(path.join(outBaseDir, path.dirname(destPath)), script.ext);
        destPath = path.join(path.dirname(destPath), destScript);
        log.info("Installing DBC template Files for cui: %s", destPath);
        templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
        return;
    } //Ending DBC installing process for cui

    log.info("UTT structure installing at: %s", destPath);
    templateArgs.code_script = "{{code_script}}";
    templates.renderToFile(template, templateArgs, path.join(outBaseDir, destPath));
};

unittest.updateUnitTestSuite = function (unittestXml, unittestXmlIn) {

    //read the maximo XML file
    var doc = unittest.readXMLFile(unittestXml);
    //read unittest xml stub
    var docIn = unittest.readXMLFile(unittestXmlIn);

    //Get XML location 
    var projects = doc.getElementsByTagName("project")[0];

    //TODO validation for append new target
    for (var i = 0; i < projects.childNodes.length; ++i) {
        var item = projects.childNodes[i];  // Calling myNodeList.item(i) isn't necessary in JavaScript

        if (item.nodeName.toString() === "target"
            && (item.attributes[0].value.toString() === docIn.documentElement.attributes[0].value)) {
            //Remove to replace within new informartion
            projects.removeChild(projects.childNodes[i]);
        }
    }



    //append the test structure to the text suite file. (May be it need a parser)
    projects.appendChild(docIn);

    //Save the maximo uniitestsuite.xml file
    unittest.update(unittestXml, doc);

    var changed = true;
    return changed;

};

unittest.updateClientConfigXml = function () {
    //read unittest xml stub
    var docIn = unittest.readXMLFile(env.unittestClientConfigXmlIn());
    //update client config at Maximo.

    xmlutil.update(env.unittestClientConfigXml(), function (xml) {
        var el = xmlutil.createElement(xml, "testcaselistener", {
            name: docIn.getElementsByTagName("testcaselistener")[0].attributes[0].value,//docIn., 
        }, null);
        var changed = false;
       
        //Set default parameters
        xml.getElementsByTagName("rmiurl")[0].textContent = docIn.getElementsByTagName("rmiurl")[0].textContent;
        xml.getElementsByTagName("realtime")[0].textContent = docIn.getElementsByTagName("realtime")[0].textContent;
        xml.getElementsByTagName("timeout")[0].textContent = docIn.getElementsByTagName("timeout")[0].textContent;

        xmlutil.appendChild(xml, xml.getElementsByTagName("testcaselisteners")[0], el, "  ", "\n  ");
        changed = true;

        return changed;
    });
};

unittest.generateClientConfigStubFile = function (args) {
    //update client config file.
    xmlutil.update(env.unittestClientConfigXmlIn(), function (xml) {
        var el = xmlutil.createElement(xml, "testcaselistener", {
            name: args.test_package + "." + args.test_name,
        }, null);
        var changed = false;
        xmlutil.appendChild(xml, xml.getElementsByTagName("testcaselisteners")[0], el, "  ", "\n  ");
        changed = true;

        return changed;
    });
};

/**
 * Get a XML object from a URL
 * @param {*} xml Location for the XML file
 */
unittest.readXMLFile = function (xml) {
    var xmlfile = fs.readFileSync(xml, "utf8");
    var doc = new DOMParser().parseFromString(xmlfile);
    return doc;
}
/**
 * Write out the XML updated
 * @param {*} unittestsuiteXml unittest xml file location (URL)
 * @param {*} doc XML object
 */
unittest.update = function (unittestsuiteXml, doc) {
    // now write out the changed contents
    var xmlOut = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(unittestsuiteXml, xmlOut, 'utf8');
};