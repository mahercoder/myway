const { Markup } = require("telegraf");
const { Scenes } = require("telegraf");
const config = require("../utils/config");
const { texts, keyboardTexts } = require("../utils/constants");
const { generateInitiativeId } = require("../utils/generate");

const scene = new Scenes.WizardScene(
  "changeInitiative",
  async (ctx) => {
    const keyboard = Markup.keyboard([keyboardTexts.common.back]).resize();
    await ctx.reply(texts.admin.changeInitiative.enter(), keyboard);
    ctx.wizard.next();
  },
  async (ctx) => {
    const link = ctx.message?.text;
    if (!link) return await ctx.reply(texts.errors.invalidValue);
    const initiativeId = generateInitiativeId(link);
    config.setConfig("initiativeId", initiativeId);
    await ctx.reply(texts.admin.changeInitiative.done);
    ctx.scene.enter("dashboard");
  }
);

scene.hears(keyboardTexts.common.back, (ctx) => {
  ctx.scene.enter("dashboard");
});

module.exports = scene;
