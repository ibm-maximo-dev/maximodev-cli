// Domain structures available

exports.structures = [
    {structure_id: 'ALN'},
    {structure_id: 'SYNONYM'},
    {structure_id: 'NUMERIC'}
];

/**
 * Return the structures when called.
 */
exports.structuresPlain = exports.structures.map(function(o) {
    return o.structure_id ; // convert to one line
});