const colors = require('colors');
const { types } = require('./maxtype_values');

// export function to list coffee
module.exports = function() {
    console.log('MAXTYPE LIST');
    console.log('------------------');

    // list on separate lines
    types.forEach((type) => {
        console.log(' - %s ', colors.cyan(type.type_id));
    });
};