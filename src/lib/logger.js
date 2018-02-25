var util = require('util');

var logger = module.exports = Object.create({});
logger.log = function() {
  if (msg && msg.indexOf('%')>=0) {
    var msg = arguments.shift();
    var args=[
        util.format(msg, arguments)
    ];
    console.log.apply(console, args);
  } else {
    console.log.apply(console, arguments);
  }
};

logger.debug = function() {
  if (arguments && arguments[0]) {
    arguments[0] = "[debug]: " + arguments[0];
    logger.log.apply(logger, arguments);
  }
};

logger.error = function() {
  if (arguments && arguments[0]) {
    arguments[0] = "[ err]: " + arguments[0];
    logger.log.apply(logger, arguments);
  }
};

logger.info = function() {
  if (arguments && arguments[0]) {
    arguments[0] = "[info]: " + arguments[0];
    logger.log.apply(logger, arguments);
  }
};

logger.warn = function() {
  if (arguments && arguments[0]) {
    arguments[0] = "[warn]: " + arguments[0];
    logger.log.apply(logger, arguments);
  }
};

logger.trace = function() {
  if (!process.env["MAXIMO_CLI_TRACE"]) return;
  if (arguments && arguments[0]) {
    arguments[0] = "[trace]: " + arguments[0];
    logger.log.apply(logger, arguments);
  }
};