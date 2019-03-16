//Find a way to inject it 
var log = require("../logger");
const xmlescape = require("xml-escape");

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

    //Escape xml-validation
    codeScript = xmlescape(codeScript);

    // encode newlines in the script
    codeScript = codeScript.replace(/[\r\n]+/g, '&#13;&#10;');

    return codeScript;
}
