var log = require('../logger');

var scriptv_py = module.exports = Object.create({});

/**
 * Validate the script code for phyton code. 
 * @param {*} codeScript Phyton script
 */
scriptv_py.validate = function (codeScript) {

    var flags = 'gim';
    var removeComments = /(#\*.*?|#[^\r\n]*$)/g;
    var strFilterRegEx = new RegExp(removeComments, flags);

    removeComments = '[' + removeComments + ']';
    //Show pattern
    //log.info('strFilterRegEx: ' + strFilterRegEx);
    //Replace commands 
    codeScript = codeScript.replace(strFilterRegEx,'');
    //TODO Implement new validation ad-hoc
    //log.info("validate Python Script:" + codeScript);
    return codeScript;
}