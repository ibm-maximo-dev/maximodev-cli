/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var log = require('./logger');
var fs = require('fs-extra');
var convert = require('xml-js');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

var xml = module.exports = Object.create({});

/**
 * Read xml and calls callback function with dom so that it can be modified.
 */
xml.update = function (xmlIn, cb) {
  var xml = fs.readFileSync(xmlIn, "utf8");
  var doc = new DOMParser().parseFromString(xml);

  if (cb) {
    if (cb(doc)) {
      // now write out the changed contents
      var xmlOut = new XMLSerializer().serializeToString(doc);
      fs.writeFileSync(xmlIn, xmlOut, 'utf8');
    }
  }
};

xml.createElement = function (doc, elName, attrs, text) {
  var el = doc.createElement(elName);
  if (text) el.textContent = text;
  if (attrs) {
    Object.keys(attrs).forEach(function (n) {
      el.setAttribute(n, attrs[n]);
    });
  }
  return el;
};

xml.appendChild = function (doc, nodeLocation, el, preText, postText) {
  if (preText) nodeLocation.appendChild(doc.createTextNode(preText));
  nodeLocation.appendChild(el);
  if (postText) nodeLocation.appendChild(doc.createTextNode(postText));
};

xml.hasNode = function(doc, nodeName, cb) {
    var nodes = doc.getElementsByTagName(nodeName);
    if (nodes) {
      for (var i=0;i<nodes.length;i++) {
        if (cb(nodes[i])) return true;
      }
  }
  return false;


};

/**
 * Convert a XML file to a Json text object
 * @param {*} xmlPath 
 */
xml.convertXMLtoJSON = function (xmlPath) {
  var xml = fs.readFileSync(xmlPath, 'utf8');
  var result = convert.xml2json(xml, {compact: false, spaces: 4, ignoreComment: false, alwaysChildren: true });
  return result;
};

xml.convertTextXMLtoJSON = function (xml) {
  var result = convert.xml2json(xml, { compact: false, spaces: 4, ignoreComment: false, alwaysChildren: true });
  return result;
};

xml.getDocFromFile = function (xmlPath) {
  //Reading this file
  var xmlFile = fs.readFileSync(xmlPath, "utf8");
  //Reading XML file
  var doc = new DOMParser().parseFromString(xmlFile);
  return doc;
}

xml.readXmlFromString = function(xmlElement){
  var doc = new DOMParser().parseFromString(xmlElement);
  return doc;
}

xml.updateDoc= function(doc, xmlPath){
  var docOut = new XMLSerializer().serializeToString(doc);
  fs.writeFileSync(xmlPath, docOut, 'utf8');
  return true;
}