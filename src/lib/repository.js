/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const log = require('./logger');
const shell = require('shelljs');
const fs = require('fs-extra');
const request = require('request');
const zlib = require('zlib');
const unzip = require('node-unzip-2');
const path = require('path');
const tar = require('tar-fs');
const dist = require('./dist');
const docker = require('./docker');
const tmp = require('temporary-directory');

var repository = module.exports = Object.create({});

function deployArtifact(sourceFolder, dest) {
  const MAXIMO_FOLDER = path.resolve(dest);
  if(fs.existsSync(MAXIMO_FOLDER)) {
    dist.copy(sourceFolder, MAXIMO_FOLDER);
  } else {
    //if it is not a folder, probably is a container name
    if(docker.exists()) {
      if(docker.containerExists(dest)) {
        if(docker.copyTo(dest, path) !== 0) {
          log.error("An error ocurred during the deploy of the artifact");
        }
      }
    }
  }
};

function isDeployable(folderPath, deployCallback, doNotDeployCallback) {
  fs.readdir(folderPath, {encoding: 'utf8'}, (err, files) => {
    if (err) {
      if(doNotDeployCallback) doNotDeployCallback(folderPath);
      return;
    }
    if(files.indexOf('applications') >= 0) {
      if(deployCallback) deployCallback(folderPath);
      return;
    }
    if(doNotDeployCallback) doNotDeployCallback(folderPath);
  });
};

function untarStream(stream, archivePath) {
    return stream.pipe(zlib.createGunzip()).pipe(tar.extract(archivePath));
}

function unzipStream(stream, archivePath) {
  return stream.pipe(unzip.Extract({ path: archivePath }));
}


repository.pull = function(url, dest) {
  if(!url) {
    log.error("Artifact URL is not valid");
    return;
  }

  tmp((err, tmpDir, cleanup) => {
    if (err) {
      log.error('Error creating tmpdir', err);
      return;
    }

    let streamFunc = null;
    if(url.endsWith('tar.gz') || url.endsWith('tgz')) {
      // outputStream = zlib.createGunzip().pipe(tar.extract(tmpDir));
      streamFunc = untarStream;
    } else if(url.endsWith('zip')) {
      streamFunc = unzipStream;
    } else {
      log.error("Could not read the archive file");
      return;
    }

    let outputStream = streamFunc(request(url), tmpDir);

    //after download and unzip, we need to deploy the artifact
    outputStream.on('finish', () => {

      fs.readdir(tmpDir, {encoding: 'utf8'}, (err, files) => {
        if (err) {
          log.error('Error reading tmpdir', err);
          return;
        }

        // check if the unziped folder can be deployed 
        // the criteria is if a 'applications' folder exists
        isDeployable(tmpDir, () => {
          deployArtifact(tmpDir, dest);
        }, () => {
          // if 'applications' folder does not exists, the zip can contain 
          // a folder with the artifact, so we check if there is a single folder
          // if yes, we try to deploy its content
          if(files.length === 1) {
            const SUBFOLDER = path.join(tmpDir, files.pop());
            isDeployable(SUBFOLDER, () => {
              deployArtifact(SUBFOLDER, dest);
            });
          } else {
            log.error("The downloaded file does not seems to contains a valid artifact");
          }
        }, () => {
          log.error("The downloaded file does not seems to contains a valid artifact");
        });
      });
    });

    outputStream.on('error', (err) => {
      log.error(err);
    });

    cleanup((err) => {
      if (err) {
        log.error('Error removing tmpdir', err);
        return;
      }
    });
  });
}
