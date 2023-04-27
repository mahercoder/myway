const allowedStatuses = ['creator', 'administrator'];

module.exports = async (ctx, next) => {
    const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    if (chatMember && allowedStatuses.includes(chatMember.status)) return next();
    return ctx.answerCbQuery("❗️ Faqat adminstratorlar uchun");
}