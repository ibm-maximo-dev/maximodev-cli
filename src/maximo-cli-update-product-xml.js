#! /usr/bin/env node

var productxml = require('./lib/productxml');
var log = require('./lib/logger');
var env = require('./lib/env');


productxml.updateVersion(env.productXmlIn(), env.scriptDir());
log.info("product xml updated with the latest version");