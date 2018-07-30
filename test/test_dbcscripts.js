var chai = require('chai');
var expect = chai.expect;
var chaifs = require('chai-files');
chai.use(chaifs);

var file = chaifs.file;
var dir = chaifs.dir;

var dbcscripts = require('../src/lib/dbcscripts');

describe('script', function() {
  it('should return a parsed script', function() {
    var lastScript = dbcscripts.script('V7601_03.dbc');
    if (lastScript==null) throw "Failed to parse V7601_03.dbc";
    expect(lastScript.fullname).to.be.equal('V7601_03.dbc');
    expect(lastScript.prefix).to.be.equal('V');
    expect(lastScript.version).to.be.equal('7601');
    expect(lastScript.number).to.be.equal(3);
    expect(lastScript.ext).to.be.equal('dbc');
  });
});

describe('lastScript', function() {
  it('should return last V script', function() {
    var lastScript = dbcscripts.lastScript('test/resources/en/testprod1');
    expect(lastScript).to.be.equal('V75011_01.dbc');
  });
  it('should return the last HF script', function() {
    var lastScript = dbcscripts.lastScript('test/resources/en/testprod2');
    expect(lastScript).to.be.equal('HF7601_01.dbc');
  });
  it('will compare using script versions and return last V script', function() {
    var lastScript = dbcscripts.lastScript('test/resources/en/testprod3');
    expect(lastScript).to.be.equal('V7601_03.dbc.in');
  });
  it('last script should be null when the directory does not exist', function() {
    var lastScript = dbcscripts.lastScript('test/resources/en/doesnotexist');
    expect(lastScript).to.be.null;
  });
  it('last script should be null when the directory is empty', function() {
    var lastScript = dbcscripts.lastScript('test/resources/en/emptydir');
    expect(lastScript).to.be.null;
  });
});

describe('nextScript', function() {
  it('next script should be default when the directory does not exist', function() {
    var nextScript = dbcscripts.nextScript('test/resources/en/doesnotexist');
    expect(nextScript).to.be.equal('V1000_01.dbc');
  });
  it('next script should be default when the directory is empty', function() {
    var nextScript = dbcscripts.nextScript('test/resources/en/emptydir');
    expect(nextScript).to.be.equal('V1000_01.dbc');
  });
});


describe('nextScriptName', function() {
  it('should next script name', function() {
    var lastScript = dbcscripts.nextScriptName('V75011_01.dbc');
    expect(lastScript).to.be.equal('V75011_02.dbc');

    lastScript = dbcscripts.nextScriptName('V75011_99.dbc');
    expect(lastScript).to.be.equal('V75011_100.dbc');

    lastScript = dbcscripts.nextScriptName(null);
    expect(lastScript).to.be.equal('V1000_01.dbc');
  });
});

describe('createNewScriptInDir', function() {
  it('should create new script in a product dir', function() {
    var name = "V7650_01.dbc";
    dbcscripts.createNewScriptInDir({
      name: name,
      author: "sean",
      description: "this is a test script"
    }, "V7650_01.dbc", "./build/test/out/dbc/");

    expect(file('./build/test/out/dbc/V7650_01.dbc')).to.exist;
    expect(file('./build/test/out/dbc/V7650_01.dbc')).to.contain("sean");
  });

});

describe('test parse log file name', function() {
  it('should parse log file name', function() {
    var output='\nsdfsdfsdf\nLog file: MXServer_RUNSCRIPT_V1000_01.msg.log\nsdfsdfsdf\n';
    var re = new RegExp('Log file: (.*)');
    var log=null;
    var r = output.match(re);
    //console.log(r);
    if (r) {
      //console.log(r);
      log = r[1];
    }
    expect(log).to.be.equal('MXServer_RUNSCRIPT_V1000_01.msg.log');
  });

});


