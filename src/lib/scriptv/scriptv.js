//Find a way to inject it 
var log = require("../logger");

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

    return scriptv.defaultXMLValidation(codeScript);
}
/**
 * Its replaces the scpecial characters  into the code. 
 * @param {*} code_script 
 */
scriptv.defaultXMLValidation = function(code_script){
    var map = new Map();
    //Define map entries.
    map.set("&", "&amp;");
    map.set("<", "&lt;");
    map.set(">", "&gt;");
    map.set("\"", "&quot;");
    map.set("'", "&apos;");
   
    for (var entry of map.entries()) {
        var key = entry[0];
        var value = entry[1];
        var regex = '(.*)^(\s)*('+key+').*(\n)?';
        var mapRegex = new RegExp(regex, 'gim');
        code_script = code_script.replace(mapRegex, value);
    }
    return code_script;
}