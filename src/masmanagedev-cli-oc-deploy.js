#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const cli = require("./lib/cli");
const env = require("./lib/env");
const zip = require("./lib/zip");
const log = require("./lib/logger");
const oc = require("./lib/oc");
const templates = require("./lib/templates");
const shell = require("shelljs");

var schema = {
  _version: "0.0.1",
  _description: "Customization archive publishment support",
  properties: {
    namespace: {
      required: true,
      description: "maximo manage namespace",
      _cli: "namespace",
    },
    buildName: {
      required: true,
      description: "customization archive build config name",
      _cli: "build-name",
      default: "customization-archive",
    },
   ws: {
      required: true,
      description:
        "maximo manage workspace name",
      _cli: "workspace",
    },
  },
};

cli.process(schema, process.argv, deploy);

function deploy(result) {
  if (!oc.exists()) {
    log.error(`Could not find oc cli, is OpenShift installed? Aborting...`);
    return;
  }

  if (!oc.loggedIn()) {
    log.error(
      `Need to login to OpenShift. Use ''oc login <openshift URL> -u <openshift admin username> -p <openshift admin password>' Aborting...`
    );
    return;
  }

  if (!oc.setNamespace(result.namespace)) {
    log.error(`The namespece does not exist. Aborting...`);
    return;
  }

  const masNamespace = oc.extractMasNamespace(result.namespace);

  // Ensure zips in dist
  const buildDir = 'dist/.';
  const latestArchiveName = oc.getLatestArchiveName(buildDir);
  if (!latestArchiveName) {
    log.error(`Could not find any customization archive. Please run the create zip command.`);
    return;
  }

  // Check and make a build config
  // Get full path for the dockerfile
  const templatePath = templates.resolveName('publisher/Dockerfile')
  if (!oc.newBuild(result.buildName, templatePath)) {
    log.error(`Could not make a new build config: ${result.buildName}`);
    return;
  }

  // Run the build
  if (!oc.startBuild(result.buildName, buildDir)) {
    log.error(`Could not build: ${result.buildName}`);
    return;
  }

  // Check and make an app
  if (!oc.newApp(result.buildName)) {
    log.error(`Could not make a new app: ${result.buildName}`);
    return;
  }

  // Check and make a route for the archive
  if (!oc.expose(result.buildName)) {
    log.error(`Could not expose a service: ${result.buildName}`);
    return;
  }

  const hostname = oc.getRouteHostName(result.buildName);
  const url = `http://${hostname}/${latestArchiveName}`;
  log.info(url);
  const manageWorkSpace = `${masNamespace}-${result.ws}`
  // Update the deployment config
  if (!oc.updateManageWorkspace(manageWorkSpace, url)) {
    log.error(`Could not update the customization archive URL: ${url}`);
    return;
  }
}
