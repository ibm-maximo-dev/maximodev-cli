//Initialize tests
var chai = require('chai');
var expect = chai.expect;
var chaifs = require('chai-files');
chai.use(chaifs);

var file = chaifs.file;
var dir = chaifs.dir;

var scriptv = require('../src/lib/scriptv/scriptv');

describe('scriptv', function () {
    it('should return a parsed script validation', function () {
        //Validate Script for Paython Script
        var code_script_py = "# get.Function()";
        var code_script_js = "// get.Function()";

        var result_py = scriptv.validate('.py',code_script_py);
        var result_js = scriptv.validate('.js',code_script_js);
        console.log("Paython removed: "+scriptv.validate('.py',code_script_py));
        console.log("JavaScript removed: "+scriptv.validate('.js',code_script_js));

        expect(!result_py.empty).to.be.true;
          //Validate Script for JavaScript 
        expect(!result_js.empty).to.be.true;
      
    });
});
