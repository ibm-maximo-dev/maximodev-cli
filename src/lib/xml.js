var log = require('./logger');
var fs = require('fs-extra');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

var xml = module.exports = Object.create({});

/**
 * Read xml and calls callback function with dom so that it can be modified.
 */
xml.update = function(xmlIn, cb) {
  var xml = fs.readFileSync(xmlIn,"utf8");
  var doc = new DOMParser().parseFromString(xml);

  if (cb) {
    if (cb(doc)) {
      // now write out the changed contents
      var xmlOut = new XMLSerializer().serializeToString(doc);
      fs.writeFileSync(xmlIn, xmlOut, 'utf8');
    }
  }
};

xml.createElement = function(doc, elName, attrs, text) {
  var el = doc.createElement(elName);
  if (text) el.textContent = text;
  if (attrs) {
    Object.keys(attrs).forEach(function(n) {
      el.setAttribute(n,attrs[n]);
    });
  }
  return el;
};

xml.appendChild = function(doc, nodeLocation, el, preText, postText) {
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