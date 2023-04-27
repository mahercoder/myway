const db = require("../models");
const { texts } = require("../utils/constants");

async function handlePaidPayments(ctx) {
  // Extract id
  const paymentId = +ctx.match[1];
  if (!paymentId) return ctx.answerCbQuery("❗️");
  //   Update payments
  const payments = await db.Payment.update(
    { isPaid: true },
    { where: { id: paymentId } }
  );
  if (!payments.length) return ctx.answerCbQuery("❗️");
  //   Get updated payment with user
  const payment = await db.Payment.findByPk(paymentId, {
    include: db.User,
  });
  //   update channel post
  ctx.editMessageText(texts.wallet.paymentInfo(payment));
  //   inform user
  ctx.telegram.sendMessage(
    payment.User.telegramId,
    texts.wallet.withdraw.paid(payment.type)
  );
  ctx.answerCbQuery("✅");
}

module.exports = { handlePaidPayments };
