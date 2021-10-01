/*
 * Copyright (c) 2021-present, Yasutaka Nishimura.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const shell = require("shelljs");
const env = require("./env");
const fs = require("fs");
const log = require("./logger");
const json2yaml = require("json2yaml");

const oc = (module.exports = Object.create({}));

oc.exists = () => {
  const ocProcess = shell.exec("oc help", { silent: true });

  //the command must have exit code === 0
  return (ocProcess ? ocProcess.code : -1) === 0;
};

oc.loggedIn = () => {
  const ocProcess = shell.exec("oc whoami", { silent: true });

  //the command must have exit code === 0
  return (ocProcess ? ocProcess.code : -1) === 0;
};

oc.setNamespace = (namespace) => {
  const ocProcess = shell.exec(`oc project ${namespace}`, { silent: true });

  //the command must have exit code === 0
  return (ocProcess ? ocProcess.code : -1) === 0;
};

oc.registryLogin = () => {
  const registry = shell
    .exec("oc registry login", { silent: true })
    .stdout.split(/(\s+)/)
    .filter((item) => {
      return item.trim().length > 0;
    });
  return registry[registry.length - 1];
};

oc.newBuild = (name, templatePath) => {
  const res = shell.exec(`oc get buildconfig ${name}`, { silent: true });

  if (res && res.code !== 0) {
    const created = shell.exec(
      `cat "${templatePath}" | oc new-build --dockerfile=- --name=${name}`,
      { silent: false }
    );
    if (created && created.code !== 0) {
      return false;
    }
  }

  return true;
};

oc.getLatestArchiveName = (dirName) => {
  if (fs.existsSync(dirName)) {
    const dir = fs.opendirSync(dirName);
    const files = [];
    let dirent;
    while ((dirent = dir.readSync())) {
      files.push(dirent.name);
    }
    return files
      .filter((f) => f.endsWith(".zip"))
      .sort()
      .pop();
  }
};

oc.startBuild = (name, buildDir) => {
  const fullBuildPath = env.addonDir(buildDir);
  const res = shell.exec(
    `oc start-build ${name} --from-dir=${fullBuildPath} --wait=true`,
    { silent: false }
  );
  return res && res.code === 0;
};

oc.newApp = (name) => {
  const res = shell.exec(`oc get deployments ${name}`, { silent: true });

  if (res && res.code !== 0) {
    const created = shell.exec(`oc new-app ${name}`, { silent: false });
    if (created && created.code !== 0) {
      return false;
    }
  }

  return true;
};

oc.expose = (name) => {
  const res = shell.exec(`oc get routes ${name}`, { silent: true });

  if (res && res.code !== 0) {
    const created = shell.exec(`oc expose service/${name}`, { silent: false });
    if (created && created.code !== 0) {
      return false;
    }
  }

  return true;
};

oc.getRouteHostName = (name) => {
  const res = shell.exec(`oc get routes ${name} -o "jsonpath={.spec.host}"`, {
    silent: true,
  });
  let hostname;
  if (res && res.code === 0) {
    hostname = res.stdout.trim();
  }
  return hostname;
};

oc.extractMasNamespace = (namespace) => {
  return namespace.slice(4, -7);
};

oc.updateCustomizationArchiveConfig = (workSpace, url) => {
  const res = shell.exec(
    `oc patch manageworkspace.apps.mas.ibm.com/${workSpace} --type merge -p '{"spec":{"settings":{"customization":{"customizationArchive":"${url}"}}}}'`
  );
  return res && res.code === 0;
};

oc.updateBuildTag = (workSpace, value) => {
  const res = shell.exec(
    `oc patch manageworkspace.apps.mas.ibm.com/${workSpace} --type merge -p '{"spec":{"settings":{"deployment":{"buildTag":"${value}"}}}}'`
  );
  return res && res.code === 0;
};

oc.updateServerTimeZone = (workSpace, value) => {
  const res = shell.exec(
    `oc patch manageworkspace.apps.mas.ibm.com/${workSpace} --type merge -p '{"spec":{"settings":{"deployment":{"serverTimezone":"${value}"}}}}'`
  );
  return res && res.code === 0;
};

oc.updateServerMode = (workSpace, value) => {
  const res = shell.exec(
    `oc patch manageworkspace.apps.mas.ibm.com/${workSpace} --type merge -p '{"spec":{"settings":{"deployment":{"mode":"${value}"}}}}'`
  );
  return res && res.code === 0;
};

oc.updateBaseLang = (workSpace, value) => {
  const res = shell.exec(
    `oc patch manageworkspace.apps.mas.ibm.com/${workSpace} --type merge -p '{"spec":{"settings":{"languages":{"baselang":"${value}"}}}}'`
  );
  return res && res.code === 0;
};

oc.updateSecondaryLangs = (workSpace, values) => {
  const payload = { spec: { settings: { languages: { secondaryLangs: {} } } } };
  payload.spec.settings.languages.secondaryLangs = values;

  const res = shell.exec(
    `oc patch manageworkspace.apps.mas.ibm.com/${workSpace} --type merge -p '${JSON.stringify(
      payload
    )}'`
  );
  return res && res.code === 0;
};

oc.getCurrentConfig = (workSpace) => {
  const res = shell.exec(
    `oc get manageworkspace.apps.mas.ibm.com/${workSpace} -o jsonpath='{ .status.settings }'`,
    { silent: true }
  );
  if (res && res.code === 0) {
    const settings = JSON.parse(res.stdout);
    delete settings.bdi;
    delete settings.bdiConfigurations;
    return json2yaml.stringify(settings);
  }
};
