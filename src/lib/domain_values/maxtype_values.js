// Max types
exports.types = [
    {type_id: 'ALN'},
    {type_id: 'UPPER'},
    {type_id: 'INTEGER'},
    {type_id: 'SMALLINT'},
    {type_id: 'DECIMAL'},
];
/**
 * Return the values when called.
 */
exports.typesPlain = exports.types.map(function(o) {
    return o.type_id ; // convert to one line
});
