#! /usr/bin/env node

/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const cli = require("./lib/cli");
const log = require("./lib/logger");
const oc = require("./lib/oc");
const tzdata = require('tzdata');

var schema = {
  _version: "0.0.1",
  _description: "Manage configuration - set server time zone",
  properties: {
    timeZone: {
      required: true,
      description: "time zone",
      _cli: "time-zone",
      default: "GMT",
      message: "time zone must be a value of the IANA TZ database",
      conform: function (v) {
        return tzdata.zones[v] !== undefined;
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
  if (tzdata.zones[result.timeZone] === undefined) {
    log.error("time zone must be a value of the IANA TZ database");
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
  if (!oc.updateServerTimeZone(manageWorkSpace, result.timeZone)) {
    log.error(`Could not update the server time zone: ${result.timeZone}`);
    return;
  }
}
