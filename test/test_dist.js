var chai = require('chai');
var expect = chai.expect;
var chaifs = require('chai-files');
chai.use(chaifs);

var path = require('path');
const shell = require('shelljs');

var file = chaifs.file;
var dir = chaifs.dir;

var dist = require('../src/lib/dist');

const TEST_DIR = 'test_dist';

describe('dist', function() {
  it('should return true', function() {
    const e = [
      { 
        name: 'Ignoring rmi-stubs files',
        patterns: [/rmi-stubs.(xml|cmd)$/],
      },
    ];
    expect(dist.canCopy('aaa-bbb-rmi-stubs.txt',e)).to.be.true;
  });

  it('should return false', function() {
    const e = [
      { 
        name: 'Ignoring rmi-stubs files',
        patterns: [/rmi-stubs.(xml|cmd)$/],
      },
    ];
    expect(dist.canCopy('aaa-bbb-rmi-stubs.cmd',e), 'failed to ignore cmd file').to.be.false;

    expect(dist.canCopy('aaa-bbb-rmi-stubs.xml',e), 'failed to ignore xml file').to.be.false;
  });

  it('should block hidden files except .resources', function() {
    const e = [
      { 
        name: 'Ignoring hidden files',
        patterns: [/^\.(?!settings)/],
      },
    ];
    expect(dist.canCopy('.git',e), 'failed to ignore .git name').to.be.false;
    expect(dist.canCopy('.gitignore',e), 'failed to ignore .gitignore name').to.be.false;
    expect(dist.canCopy('.a_b',e), 'failed to ignore a_b name').to.be.false;
    expect(dist.canCopy('b_a',e), 'failed to accept b_a name').to.be.true;
    expect(dist.canCopy('.settings',e), 'failed to accept .settings name').to.be.true;
    expect(dist.canCopy('b.a',e), 'failed to accept b.a name').to.be.true;
  });

  it('should ignore just unittest name', function() {
    const e = [
      { 
        name: 'Unit test folder',
        patterns: [/^unittest$/],
      },
    ];
    expect(dist.canCopy('unittest',e), 'failed to ignore folder name').to.be.false;
    expect(dist.canCopy('myunittestfile.txt',e), 'failed to accept file name').to.be.true;
  });

  it('should parse regex correctly', function() {
    const e = [
      { 
        name: 'Unit test folder',
        patterns: [/^installer(Imports)?$/],
      },
    ];
    expect(dist.canCopy('installer',e), 'failed to ignore installer name').to.be.false;
    expect(dist.canCopy('installerImports',e), 'failed to ignore installerImports name').to.be.false;
    expect(dist.canCopy('installerImporting',e), 'failed to accept installerImporting name').to.be.true;
  });

  it('should ignore template files', function() {
    const e = [
      { 
        name: 'Template file',
        patterns: [/.\.in$/],
      },
    ];
    expect(dist.canCopy('product.xml.in',e), 'failed to ignore template file name').to.be.false;
    expect(dist.canCopy('product.xml',e), 'failed to accept product file name').to.be.true;
    expect(dist.canCopy('bin',e), 'failed to accept a filename ending with in that is not a extension').to.be.true;
  });

  it('should create dist successfully', function() {
    const excludes = [
      { 
        name: 'mi-stubs files',
        patterns: [/(rmi-stubs.(xml|cmd))$/],
      },
      { 
        name: 'Hidden files',
        patterns: [/^\./],
      },
      { 
        name: 'Unit test folder',
        patterns: [/unittest/],
      },
      { 
        name: 'virtual folder',
        patterns: [/virtual/],
      },
      { 
        name: 'Source folder',
        patterns: [/src/],
      },
      { 
        name: 'Node modules folder',
        patterns: [/node_modules/],
      },
      { 
        type: 'resources folders and files',
        patterns: [/copy-resources.xml/],
      },
    ];
    const buildFolder = path.join(shell.env['PWD'], 'test', TEST_DIR);
    const outputFolder = path.join(buildFolder, dist.BUILD_FOLDER_NAME);
    shell.rm('-Rf',outputFolder);
    dist.build(buildFolder, excludes);
    expect(dir(outputFolder)).to.exist;
    expect(shell.test('-f',path.join(outputFolder, 'aaa-bbb-rmi-stubs.txt')), 'failed to copy aaa-bbb-rmi-stubs.txt').to.be.true;
    expect(shell.test('-f',path.join(outputFolder, 'aaa-bbb-rmi-stubs.cmd')), 'failed to ignore aaa-bbb-rmi-stubs.cmd').to.be.false;
    expect(shell.test('-f',path.join(outputFolder, 'aaa-bbb-rmi-stubs.xml')), 'failed to ignore aaa-bbb-rmi-stubs.xml').to.be.false;
    expect(shell.test('-f',path.join(outputFolder, 'sub', 'aaa-bbb-rmi-stubs.txt')), 'failed to copy sub/aaa-bbb-rmi-stubs.txt').to.be.true;
    expect(shell.test('-d',path.join(outputFolder, 'sub', 'node_modules')), 'failed to ignore node_modules').to.be.false;
  });

  it('should check if a folder can be built correctly', function() {
    const buildFolder = path.join(shell.env['PWD'], 'test');
    expect(dist.canBuild(buildFolder)).to.be.true;
  });
});