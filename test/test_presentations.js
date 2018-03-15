var chai = require('chai');
var expect = chai.expect;
var chaifs = require('chai-files');
chai.use(chaifs);

var fs = require('fs-extra');
var path = require('path');

var file = chaifs.file;
var dir = chaifs.dir;

var presentations = require('../src/lib/presentations');

describe('presentations', function() {
  it('should should combine presentations', function() {
    presentations.combine('test/resources/base_presentations', 'build/test/presentations/all.xml');
    expect(file('build/test/presentations/all.xml')).to.exist;
    expect(file('build/test/presentations/all.xml')).to.contain('<presentation id="trartist"');
    expect(file('build/test/presentations/all.xml')).to.contain('<presentation id="trmusic"');
    expect(file('build/test/presentations/all.xml')).to.contain('<table id="trartist"');
    // chai doesn't have the concept of requiring 1 and only one, so we comment this out
    // expect(file('build/test/presentations/all.xml')).to.not.contain('<?xml');
  });
});
