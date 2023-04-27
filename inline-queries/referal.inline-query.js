const { Markup } = require("telegraf");
const { texts } = require("../utils/constants");

function handleInlineReferral(ctx) {
  const link = `https://t.me/${ctx.botInfo.username}?start=${ctx.session.user.id}`;
  const keyboard = Markup.inlineKeyboard([
    Markup.button.url(texts.common.referralButton, link),
  ]);
  const results = [
    {
      type: "article",
      id: 1,
      title: "Referal havolani ulashish",
      input_message_content: {
        message_text: texts.common.referralAd(link),
        parse_mode: "HTML",
      },
      ...keyboard,
    },
  ];
  ctx.answerInlineQuery(results, {
    cache_time: 0,
  });
}

module.exports = { handleInlineReferral };
