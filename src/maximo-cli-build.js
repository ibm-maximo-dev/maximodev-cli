#! /usr/bin/env node

var program = require('commander');
var log = require('./lib/logger');
var gradle = require('./lib/gradle');

program
  .version('0.0.1')
  .description('Build the current Maximo artifact')
  .parse(process.argv);

log.log('Building Maximo...');

// Read the current directory.

// Identify that it is a valid a folder structure created by create addon or create sample-add commands.

// Run task build of any present gradle script.
if(gradle.exists()) {
  log.log('Gradle Found');
  gradle.build();
}

// Create build output folder.

// Replicate add-on or app folder structure, making sure that no unnecessary folder will be created (a folder that will end up empty in the end of the process).

// Copy binary files (jar's,class's) to their correct destination folder, configuration files (xml's) any other supporting files.

// Update product.xml when necessary.

