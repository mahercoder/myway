const { Scenes, Markup } = require("telegraf");
const { keyboardTexts, texts } = require("../utils/constants");

const scene = new Scenes.BaseScene("wallet");

scene.enter((ctx) => {
  // get balance info
  const { user } = ctx.session;

  const text = texts.wallet.balance(user.balance);
  const keyboard = Markup.keyboard([
    [keyboardTexts.wallet.card, keyboardTexts.wallet.phone],
    [keyboardTexts.common.back],
  ]).resize();
  ctx.reply(text, keyboard);
});

scene.hears(keyboardTexts.wallet.phone, (ctx) => {
  ctx.scene.enter("withdraw", { type: "phone" });
});

scene.hears(keyboardTexts.wallet.card, (ctx) => {
  ctx.scene.enter("withdraw", { type: "card" });
});

scene.hears(keyboardTexts.common.back, (ctx) => ctx.scene.enter("start"));

module.exports = scene;
