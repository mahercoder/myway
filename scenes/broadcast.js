const { Scenes, Markup } = require("telegraf");
const db = require("../models");
const { texts, keyboardTexts } = require("../utils/constants");

const scene = new Scenes.WizardScene(
  "broadcast",
  (ctx) => {
    const keyboard = Markup.keyboard([keyboardTexts.common.back]).resize();
    ctx.reply(texts.admin.broadcast.enter, keyboard);
    ctx.wizard.next();
  },
  async (ctx) => {
    const users = await db.User.findAll();
    for (let user of users) {
      try {
        await ctx.copyMessage(user.telegramId);
      } catch (err) {}
    }
    await ctx.reply(texts.admin.broadcast.done);
    ctx.scene.enter("dashboard");
  }
);

scene.hears(keyboardTexts.common.back, (ctx) => ctx.scene.enter("dashboard"));

module.exports = scene;
