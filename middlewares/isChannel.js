module.exports = (ctx, next) => {
  if (ctx.chat.type === "channel") {
    return next();
  }
  return;
};
