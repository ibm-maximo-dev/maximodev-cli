#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const cli = require("./lib/cli");
const log = require("./lib/logger");
const oc = require("./lib/oc");
const langList = require('./lib/manage_config/lang_list');
const langValues = require('./lib/manage_config/lang_values');

var schema = {
  _version: "0.0.1",
  _description: "Manage configuration - set base language",
  properties: {
    lang: {
      required: true,
      description: "base language",
      _cli: "lang",
      default: "EN",
      message: "lang must be a desinated string",
      ask: function () {
        langList();
        return true;
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
  },
};

cli.process(schema, process.argv, deploy);

function deploy(result) {
  const lang = result.lang.trim().toUpperCase();
  if (!langValues.check(lang)) {
    log.error(`Invalid language code.`);
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

  const namespace = `mas-${result.instance.trim()}-manage`;

  if (!oc.setNamespace(namespace)) {
    log.error(`Manage namespece ${namespace} does not exist. Aborting...`);
    return;
  }

  const manageWorkSpace = `${result.instance.trim()}-${result.workspace.trim()}`;
  // Update the deployment config
  if (!oc.updateBaseLang(manageWorkSpace, lang)) {
    log.error(`Could not update the base language: ${lang}`);
    return;
  }
}
