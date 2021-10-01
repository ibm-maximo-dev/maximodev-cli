const colors = require("colors");
const { lang_codes } = require("./lang_values");

// export function to list lang codes available
module.exports = function () {
  console.log("LANG CODE");
  console.log("------------------");

  // list on separate lines
  lang_codes.forEach((mode, i) => {
    console.log(" - %s ", colors.cyan(mode.lang_id));
  });
};
