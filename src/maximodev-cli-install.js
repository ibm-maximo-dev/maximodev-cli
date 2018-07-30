#! /usr/bin/env node

/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
var prompt = require('prompt');
const repo = require('./lib/repository');
const cli = require('./lib/cli');
const docker  = require('./lib/docker');

const schema = {
  _version: '0.0.1',
  _description: 'Pull a Maximo artifact from the repository',
  properties: {
    addon_url: {
      description: "Addon URL",
      required: true,
      _cli: 'url',
      default: '',
    },
    addon_name: {
      description: "Addon Name",
      name: "Addon Name",
      required: true,
      _cli: 'name',
      default: '',
      ask: function() {
        return (prompt.history('addon_url') && prompt.history('addon_url').value && prompt.history('addon_url').value.length === 0);
      }
    },
    addon_release: {
      description: "Semantic Version",
      required: true,
      _cli: 'release',
      default: '1.0.0',
      ask: function() {
        return (prompt.history('addon_url') && prompt.history('addon_url').value && prompt.history('addon_url').value.length === 0);
      }
    },
    dest: {
      description: "Install destination",
      required: true,
      default: process.env.MAXIMO_HOME,
      _cli: 'dest',
      message: "Valid values: Path to Maximo folder or a Maximo instance container name",
      conform: function(v) {
        if(!v || v.length === 0) return false;
        if(fs.existsSync(path.resolve(v))) {
          return true;
        } else {
          if(docker.exists()) {
            if(docker.containerExists(v)) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
};
cli.process(schema, process.argv, install);

function install(result) {
  if(result) {
    var url = '';
    if(result.addon_url) {
      url = result.addon_url;
    } else {
      const [ ORGNAME, REPONAME ] = result.addon_name.split('/');
      const BASE_URL = 'https://github.com';
      var url = `${BASE_URL}/${ORGNAME}/${REPONAME}/archive/${result.addon_release}.tar.gz`;
    }
    repo.pull(url, result.dest);
  }
}

