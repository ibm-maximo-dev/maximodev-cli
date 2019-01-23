//Find a way to inject it 
var log = require("../logger");
var he = require('he');

var scriptv = module.exports = Object.create({});

/**
 * This should work as a polymorphism for Node.js 
 * @param {*} script_extention 
 */
scriptv.validate = function (script_extention, codeScript) {
    //Reinitialize the variable
    var v_obj = null;
    v_obj = require('./validator' + script_extention + '');
    //Test validation
    //log.info("Test Object script:+" + v_obj);
    //Implement the validation script
    codeScript = v_obj.validate(codeScript)

    return he.escape(codeScript);
}
