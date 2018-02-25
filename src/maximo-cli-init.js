var program = require('commander');

program
  .version('0.0.1')
  .description('Maximo initialize build tools and configurations')
  .command('java', 'initialize current directory for java building.  will install gradle.').alias('j')
  .command('addon', 'initialize addon properties in the current directory').alias('a')
  .parse(process.argv);
