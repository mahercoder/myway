const config = require("../utils/config");

module.exports = (ctx, next) => {
  if (config.superadmins.includes(ctx.from.id)) {
    return next();
  }
  return;
};
