var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaifs = require('chai-files');
chai.use(chaifs);

var fs = require('fs-extra');
var path = require('path');
var shelljs = require('shelljs');

var file = chaifs.file;
var dir = chaifs.dir;

var env = require('../src/lib/env');

describe('test_command_lines', function() {
  it('create addon should not fail', function() {
    shelljs.exec('node src/maximo-cli.js create addon --addon_prefix "BPAAA"  --addon_name "bpaaa_prod1"  --author "bpaaa"  --desc ""  --ver "1.0.0.0"   --java_support --java_package "bpaaa_prod1"  --maximo_home "." --output_directory "build/testaddon/"');
    if (shelljs.error()) {
      assert.fail(0,1, "create addon failed")
    }
    expect(dir('build/testaddon/bpaaa_prod1')).to.exist;
  });

  it('create product xml should not fail', function() {
    shelljs.exec('node src/maximo-cli.js create product-xml --addon_prefix "test"  --addon_name "test_prod1"  --author "test"  --desc ""  --ver "1.0.0.0"  --xml "build/newproductxml/applications/maximo/properties/product/test_prod1.xml"');
    if (shelljs.error()) {
      assert.fail(0,1, "create productxml failed")
    }

    expect(file('build/newproductxml/applications/maximo/properties/product/test_prod1.xml.in')).to.exist;
  });

  it('create dbc script should not fail', function() {
    shelljs.exec('node src/maximo-cli.js create dbc-script --dir "build/newdbcscript/tools/maximo/en/test123"  --scriptname "V1000_02.dbc"');
    if (shelljs.error()) {
      assert.fail(0,1, "create dbc script failed")
    }
    expect(file('build/newdbcscript/tools/maximo/en/test123/V1000_02.dbc')).to.exist;
  });

  it('init java should not fail', function() {
    shelljs.exec('node src/maximo-cli.js init java --dir "build/java"');
    if (shelljs.error()) {
      assert.fail(0,1, "init java failed")
    }
    expect(file('build/java/build.gradle')).to.exist;
  });

  it('init addon should not fail', function() {
    shelljs.exec('node src/maximo-cli.js init addon --addon_prefix "BPAAA"  --addon_name "bpaaa_prod1"  --author "bpaaa"  --desc ""  --ver "1.0.0.0"  --maximo_home "."  --create_productxml --dir "build/initaddon"');
    if (shelljs.error()) {
      assert.fail(0,1, "init addon failed")
    }
    expect(file('build/initaddon/addon.properties')).to.exist;
    expect(file('build/initaddon/applications/maximo/properties/product/bpaaa_prod1.xml.in')).to.exist;
  });
});
