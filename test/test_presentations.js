var chai = require('chai');
var expect = chai.expect;
var chaifs = require('chai-files');
chai.use(chaifs);

var file = chaifs.file;

var presentations = require('../src/lib/presentations');

describe('presentations', function() {
  it('should should combine presentations', function() {
    presentations.combine('test/resources/new_presentations', 'build/test/presentations/all.xml');
    expect(file('build/test/presentations/all.xml')).to.exist;
    expect(file('build/test/presentations/all.xml')).to.contain('<presentation id="trartist"');
    expect(file('build/test/presentations/all.xml')).to.contain('<presentation id="trmusic"');
    expect(file('build/test/presentations/all.xml')).to.contain('<table id="trartist123"');
    // chai doesn't have the concept of requiring 1 and only one, so we comment this out
    // expect(file('build/test/presentations/all.xml')).to.not.contain('<?xml');
  });

  // NOTE: this can only run if MAXIMO_HOME is set
  xit('create delta from 2 dirs', function() {
    var out = 'build/test/presentations/delta.mxs';
    presentations.diffAll('test/resources/base_presentations', 'test/resources/new_presentations', out);
    expect(file(out)).to.exist;
    expect(file(out)).to.contain('id="trartist"');
    expect(file(out)).to.contain('id="trmusic"');
    expect(file(out)).to.contain('value="trartist123"');
    // chai doesn't have the concept of requiring 1 and only one, so we comment this out
    // expect(file('build/test/presentations/all.xml')).to.not.contain('<?xml');
  });
});
