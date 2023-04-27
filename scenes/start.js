const { Scenes, Markup } = require("telegraf");
const { keyboardTexts, texts } = require("../utils/constants");

const scene = new Scenes.BaseScene("start");

scene.enter((ctx) => {
  const text = texts.start.enter;
  const keyboard = Markup.keyboard([
    [keyboardTexts.start.vote],
    [keyboardTexts.start.wallet, keyboardTexts.start.withdraw],
    [keyboardTexts.start.referral],
    [keyboardTexts.start.info],
  ]).resize();
  ctx.reply(text, keyboard);
});

scene.hears(keyboardTexts.start.vote, (ctx) => ctx.scene.enter("vote"));
scene.hears(keyboardTexts.start.withdraw, (ctx) => ctx.scene.enter("wallet"));
scene.hears(keyboardTexts.start.wallet, (ctx) => {
  // get balance info
  const { user } = ctx.session;

  const text = texts.wallet.balance(user.balance);
  ctx.reply(text);
})
scene.hears(keyboardTexts.start.referral, (ctx) => {
  const referralLink = `https://t.me/${ctx.botInfo.username}?start=${ctx.session.user.id}`;
  const keyboard = Markup.inlineKeyboard([
    Markup.button.switchToChat(texts.start.shareReferral, "referal"),
  ]);
  ctx.reply(texts.start.referral(referralLink), keyboard);
});
scene.hears(keyboardTexts.start.info, (ctx) => {
  ctx.reply(texts.start.info);
});

module.exports = scene;
