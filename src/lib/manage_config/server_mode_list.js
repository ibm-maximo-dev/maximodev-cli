const colors = require("colors");
const { server_modes } = require("./server_mode_values");

// export function to list server modes available
module.exports = function () {
  console.log("SERVER MODES");
  console.log("------------------");

  // list on separate lines
  server_modes.forEach((mode, i) => {
    console.log(" - %s ", colors.cyan(mode.mode_id));
  });
};
