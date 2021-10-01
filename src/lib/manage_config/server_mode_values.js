// Domain server modes available

exports.server_modes = [{ mode_id: "up" }, { mode_id: "down" }];
exports.check = (v) => this.serverModePlain.includes(v);

/**
 * Return the server mode when called.
 */
exports.serverModePlain = exports.server_modes.map(function (o) {
  return o.mode_id; // convert to one line
});
