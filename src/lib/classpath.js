/*
 * Copyright (c) 2021-present, Yasutaka Nishimura
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const log = require("./logger");
const fs = require("fs-extra");
const xmlutil = require("./xml");
const util = require("util");
const path = require("path");

var classpath = (module.exports = Object.create({}));

const deploymentXmls = [
  "buildmaximojmsconsumer-ear.xml",
  "buildmaximomea-ear.xml",
  "maximo-all.xml",
];

classpath.getJarPaths = function (destDir) {
  const libDir = path.join(destDir, "applications", "maximo", "lib");

  if (fs.existsSync(libDir)) {
    const jars = fs
      .readdirSync(libDir)
      .filter((filename) => filename.endsWith(".jar"));
    return jars.length > 0 ? jars : undefined;
  }
  return;
};

function testFiles(dir, files) {
  for (var i = 0; i < files.length; i++) {
    if (!fs.existsSync(path.join(dir, files[i]))) {
      return false;
    }
  }

  return true;
}

classpath.updateClasspath = function (maximoHome, destDir, jars) {
  const inputDir = path.join(maximoHome, "deployment", "was-liberty-default");
  if (!fs.existsSync(inputDir) && testFiles(inputDir, deploymentXmls)) {
    throw new Error("Maximo Home is not set up correctly.");
  }

  const outputDir = path.join(destDir, "deployment", "was-liberty-default");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirpSync(outputDir);
  }

  const manifestJarsLine = jars.map((jar) => `lib/${jar}`).join(" ");

  log.info(`Add the lines ${manifestJarsLine} to businessobjectclasspath.`);

  deploymentXmls.forEach((filename) => {
    const doc = xmlutil.getDocFromFile(path.join(inputDir, filename));
    // find property name="maximo.businessobjectsclasspath"
    var nodes = doc.getElementsByTagName("property");
    if (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        // log.debug(nodes[i]);
        if (
          nodes[i].getAttribute("name") === "maximo.businessobjectsclasspath"
        ) {
          const classpathNode = nodes[i];
          const original = classpathNode.getAttribute("value");
          const newClasspath = `${original} ${manifestJarsLine}`;
          classpathNode.setAttribute("value", newClasspath);
          const outputPath = path.join(outputDir, filename);
          // touch the file first
          fs.closeSync(fs.openSync(outputPath, 'w'));
          if (!xmlutil.updateDoc(doc, outputPath)) {
            throw new Error(`Failed to write a deployment xml file ${outputPath}`);
          }
          break;
        }
      }
    }
  });
};
