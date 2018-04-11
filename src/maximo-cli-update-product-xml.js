#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var productxml = require('./lib/productxml');
var log = require('./lib/logger');
var env = require('./lib/env');


productxml.updateVersion(env.productXmlIn(), env.scriptDir());
log.info("product xml updated with the latest version");