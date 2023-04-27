const db = require("../models");

module.exports = async (ctx, next) => {
  // if (ctx.session?.user) return next();
  let user = await db.User.findOne({ where: { telegramId: ctx.from.id } });
  if (!user) {
    user = await db.User.create({
      telegramId: ctx.from.id,
      name: ctx.from.first_name + (ctx.from.last_name ? (" " + ctx.from.lastName) : ""),
    });
  }
  ctx.session.user = user;
  return next();
};
