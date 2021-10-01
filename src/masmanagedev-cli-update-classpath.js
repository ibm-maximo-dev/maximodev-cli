#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const log = require("./lib/logger");
const env = require("./lib/env");
const classpath = require("./lib/classpath");
const cli = require('./lib/cli');

const schema = {
  _version: "0.0.1",
  _description: "Update the classpath to add third-party jar files",
  properties: {},
};

cli.process(schema, process.argv, function (results) {
  if (!env.isValidMaximoHome()) {
    log.error(
      "Failed to update the classpath because MAXIMO_HOME is not set to a valid Maximo Home directory"
    );
    return;
  }

  const destDir = process.cwd();
  // Get list of jars in current lib dir
  const jars = classpath.getJarPaths(destDir);
  if (!jars) {
    log.error("No third-party jars found in your lib directory.");
    return;
  }
  // log.debug(`jars: ${jars}`);

  // Update classpath
  classpath.updateClasspath(env.maximoHome(), destDir, jars);

  log.info(" added your third-party jar files to classpath.");
});
