module.exports = async (ctx, next) => {
  // extract code
  const id = +ctx.message.text?.substring(7, ctx.message.text.length);
  if (!id || id === ctx.session.user.id) return next();
  return ctx.scene.enter("vote", { referrer: id });
};
