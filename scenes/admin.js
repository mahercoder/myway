const { Op } = require("sequelize");
const { Scenes, Markup } = require("telegraf");
const db = require("../models");
const config = require("../utils/config");
const { keyboardTexts, texts } = require("../utils/constants");

const scene = new Scenes.BaseScene("dashboard");

scene.enter((ctx) => {
  const keyboard = Markup.keyboard([
    [keyboardTexts.admin.statistics],
    [keyboardTexts.admin.broadcast],
    [keyboardTexts.admin.changeInitiative],
    [keyboardTexts.admin.leave],
  ]).resize();
  ctx.reply(texts.admin.enter, keyboard);
});

scene.hears(keyboardTexts.admin.statistics, async (ctx) => {
  // get statistics text
  // votes, cost for votes, cost for refers, completed payments
  const votes = await db.Vote.count();
  const votesFee = votes * config.voteCost;
  const refers = await db.Vote.count({
    where: {
      referrerId: { [Op.not]: null },
    },
  });
  const refersFee = refers * config.referCost;
  const payments = await db.Payment.findAll();
  const total = payments.length;
  const totalFee = payments.reduce((total, current) => total + current.amount, 0);
  const paidPayments = payments.filter(payment => payment.isPaid);
  const paid = paidPayments.length;
  const paidFee = paidPayments.reduce((total, current) => total + current.amount, 0);
  ctx.reply(
    texts.admin.statistics({
      votes,
      votesFee,
      refers,
      refersFee,
      payments: { paid, total, paidFee, totalFee },
    })
  );
});

scene.hears(keyboardTexts.admin.broadcast, (ctx) => ctx.scene.enter("broadcast"));

scene.hears(keyboardTexts.admin.changeInitiative, (ctx) =>
  ctx.scene.enter("changeInitiative")
);

scene.hears(keyboardTexts.admin.leave, (ctx) => ctx.scene.enter("start"));

module.exports = scene;
