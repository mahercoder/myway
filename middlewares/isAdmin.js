const config = require("../utils/config");

module.exports = (ctx, next) => {
  if (config.admins.includes(ctx.from.id)) {
    return next();
  }
  return;
};
