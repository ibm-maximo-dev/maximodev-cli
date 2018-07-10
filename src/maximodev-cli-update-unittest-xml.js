#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var unittest = require('./lib/unittest');
var log = require('./lib/logger');
var env = require('./lib/env');

//Update unittest classic 
if (env.unittestXmlIn()){
    unittest.updateUnitTestSuite(env.unittestXml(), env.unittestXmlIn());
}

//update unittest client config
if(env.unittestClientConfigXmlIn()){
    unittest.updateClientConfigXml();
}

log.info(" the unittestsuite.xml file was updated with your test case.");