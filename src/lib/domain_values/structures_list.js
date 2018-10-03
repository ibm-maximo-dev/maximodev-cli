const colors = require('colors');
const { structures } = require('./structures_values');

// export function to list domain structures available
module.exports = function() {
    console.log('DOMAIN TYPES');
    console.log('------------------');

    // list on separate lines
    structures.forEach((structure,i) => {
        console.log(' - %s ', colors.cyan(structure.structure_id));
    });
};