const { Scenes, Markup } = require("telegraf");
const db = require("../models");
const config = require("../utils/config");
const { texts, keyboardTexts } = require("../utils/constants");

const scene = new Scenes.WizardScene(
  "withdraw",
  (ctx) => {
    const { type } = ctx.scene.state;
    const keyboard = Markup.keyboard([keyboardTexts.common.back]).resize();
    ctx.reply(texts.wallet.withdraw.detail(type), keyboard);
    ctx.wizard.next();
  },
  (ctx) => {
    const detail = ctx.message?.text;
    if (!detail) return ctx.reply(texts.errors.invalidValue);
    ctx.wizard.state.detail = detail;
    ctx.reply(texts.wallet.withdraw.amount);
    ctx.wizard.next();
  },
  async (ctx) => {
    const amount = +ctx.message?.text;
    if (!amount || isNaN(amount)) return ctx.reply(texts.errors.invalidValue);
    if (amount < config.minWithdraw) return ctx.reply(texts.errors.lessThanMin);
    if (amount > ctx.session.user.balance)
      return ctx.reply(texts.errors.notEnoughBalance);

    const payment = await db.Payment.create({
      userId: ctx.session.user.id,
      type: ctx.wizard.state.type,
      detail: ctx.wizard.state.detail,
      amount,
      isPaid: false,
    });
    // Update user balance
    await db.User.update(
      {
        balance: ctx.session.user.balance - amount,
      },
      {
        where: {
          id: ctx.session.user.id,
        },
      }
    );
    const user = await db.User.findByPk(ctx.session.user.id);
    ctx.session.user = user;

    const text = texts.wallet.paymentInfo(payment);
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback(
        keyboardTexts.wallet.paymentDone,
        `paid_${payment.id}`
      ),
    ]);
    ctx.telegram.sendMessage(config.channel, text, keyboard);

    ctx.reply(texts.wallet.withdraw.applied);
    ctx.scene.enter("start");
  }
);

scene.hears(keyboardTexts.common.back, (ctx) => ctx.scene.enter("wallet"));

module.exports = scene;
