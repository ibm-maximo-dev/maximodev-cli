var chai = require('chai');
var expect = chai.expect;
var chaifs = require('chai-files');
chai.use(chaifs);

var fs = require('fs-extra');
var path = require('path');

var file = chaifs.file;
var dir = chaifs.dir;

var env = require('../src/lib/env');

describe('env', function() {
  it('should have addon properties', function() {
    expect(env.propfile).to.exist;
    expect(env.addonId()).to.equal('test123');
    expect(dir(env.PROJECT_ROOT)).to.exist;
    console.log(env.PROJECT_ROOT);
  });

  it('should have script dir', function() {
    var adir = env.scriptDir();
    expect(dir(adir)).to.exist;
  });

  it('should have product xml dir', function() {
    var adir = env.productXml();
    expect(dir(path.dirname(adir))).to.exist;
  });

  it('should resolve a full maximo path', function() {
    env.props.maximo_home='/maximo';
    expect(env.resolveMaximoPath('applications/maximo/testfile.ext')).to.equal('/maximo/applications/maximo/testfile.ext');
  });

});
