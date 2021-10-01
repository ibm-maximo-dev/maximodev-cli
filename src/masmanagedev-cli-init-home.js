#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const cli = require("./lib/cli");
const env = require("./lib/env");
const log = require("./lib/logger");
const docker = require("./lib/docker");
const oc = require("./lib/oc");
const shell = require("shelljs");

var schema = {
  _version: "0.0.1",
  _description: "Maximo Home initialize support",
  properties: {
    dir: {
      required: true,
      description: "maximo home directory",
      default: ".",
      _cli: "dir",
      _prop: "maximo_home",
      message: "maximo home directory has already been configured",
      conform: function (v) {
        return !env.isValidMaximoHome(v);
      },
    },
    instance: {
      required: true,
      description: "maximo application suite instance name",
      _cli: "instance",
    },
    workspace: {
      required: true,
      description: "maximo manage workspace name",
      _cli: "workspace",
    },
    tag: {
      required: false,
      default: "latest",
      message: "build tag",
      _cli: "tag",
    },
  },
};

cli.process(schema, process.argv, initialize_home);

function initialize_home(result) {
  if (env.isValidMaximoHome(result.dir)) {
    log.error(`Maximo Home is already configured. Aborting...`);
    return;
  }

  if (!docker.exists()) {
    log.error(`Could not find docker cli, is Docker installed? Aborting...`);
    return;
  }

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

  const namespace = `mas-${result.instance}-manage`;
  if (!oc.setNamespace(namespace)) {
    log.error(`Manage namespece ${namespace} does not exist. Aborting...`);
    return;
  }

  const hostname = oc.registryLogin();
  const tag = result.tag ? result.tag : "latest";
  const image = `${result.instance}-${result.workspace}-admin:${tag}`;

  let proc = docker.pull(image, namespace, hostname);
  if (proc && proc.code !== 0) {
    log.error(
      `Could not pull the image from ${hostname}/${namespace}/${image}`
    );
    return;
  }

  proc = docker.run(image, namespace, hostname);
  if (proc && proc.code !== 0) {
    log.error(
      `Could not run the admin image ${hostname}/${namespace}/${image}`
    );
    return;
  }

  const containerId = proc.stdout.trim();

  log.info(`container: ${containerId}`);
  docker.getLatestCodes(containerId, result.dir);
  docker.rm(containerId);

  if (env.isValidMaximoHome(result.dir)) {
    log.info("Maximo home configured successfully.");
  } else {
    log.info("Maximo home setup failed.");
  }
}
