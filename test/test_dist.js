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
        pattern: /rmi-stubs.(xml|cmd)$/,
      },
    ];
    expect(dist.canCopy('aaa-bbb-rmi-stubs.txt',e)).to.be.true;
  });

  it('should return false', function() {
    const e = [
      { 
        name: 'Ignoring rmi-stubs files',
        pattern: /rmi-stubs.(xml|cmd)$/,
      },
    ];
    expect(dist.canCopy('aaa-bbb-rmi-stubs.cmd',e)).to.be.false;

    expect(dist.canCopy('aaa-bbb-rmi-stubs.xml',e)).to.be.false;
  });

  it('should block hidden files', function() {
    const e = [
      { 
        name: 'Ignoring hidden files',
        pattern: /^\./,
      },
    ];
    expect(dist.canCopy('.git',e)).to.be.false;
    expect(dist.canCopy('.gitignore',e)).to.be.false;
    expect(dist.canCopy('.a_b',e)).to.be.false;
    expect(dist.canCopy('.a',e)).to.be.false;
    expect(dist.canCopy('b_a',e)).to.be.true;
  });

  it('should create dist successfully', function() {
    const excludes = [
      { 
        name: 'mi-stubs files',
        pattern: /(rmi-stubs.(xml|cmd))$/,
      },
      { 
        name: 'Hidden files',
        pattern: /^\./,
      },
      { 
        name: 'Unit test folder',
        pattern: /unittest/,
      },
      { 
        name: 'virtual folder',
        pattern: /virtual/,
      },
      { 
        name: 'Source folder',
        pattern: /src/,
      },
      { 
        name: 'Node modules folder',
        pattern: /node_modules/,
      },
      { 
        type: 'copy-resources file',
        pattern: /copy-resources.xml/,
      },
    ];
    const buildFolder = path.join(shell.env['PWD'], 'test', TEST_DIR);
    const outputFolder = path.join(buildFolder, dist.BUILD_FOLDER_NAME);
    shell.rm('-Rf',outputFolder);
    dist.build(buildFolder, excludes);
    expect(dir(outputFolder)).to.exist;
    expect(shell.test('-f',path.join(outputFolder, 'aaa-bbb-rmi-stubs.txt'))).to.be.true;
    expect(shell.test('-f',path.join(outputFolder, 'aaa-bbb-rmi-stubs.cmd'))).to.be.false;
    expect(shell.test('-f',path.join(outputFolder, 'aaa-bbb-rmi-stubs.xml'))).to.be.false;
    expect(shell.test('-f',path.join(outputFolder, 'sub', 'aaa-bbb-rmi-stubs.txt'))).to.be.true;
    expect(shell.test('-d',path.join(outputFolder, 'sub', 'node_modules'))).to.be.false;
  });
});