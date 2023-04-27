const bot = require("../core/bot");
const isSuperAdmin = require("../middlewares/isSuperAdmin");
const config = require("../utils/config");

bot.command("shutdown", isSuperAdmin, (ctx) => {
  ctx.reply("✅ Shutting down...");
  process.exit(1);
});

bot.command("setVoteCost", isSuperAdmin, (ctx) => {
  const cost = +getArguments("/setVoteCost", ctx.message.text);
  if (isNaN(cost)) return;
  const result = config.setConfig("voteCost", cost);
  if (!result) return ctx.reply("❌");
  ctx.reply("✅");
});
bot.command("setReferCost", isSuperAdmin, (ctx) => {
  const cost = +getArguments("/setReferCost", ctx.message.text);
  if (isNaN(cost)) return;
  const result = config.setConfig("referCost", cost);
  if (!result) return ctx.reply("❌");
  ctx.reply("✅");
});
bot.command("setMinWithdraw", isSuperAdmin, (ctx) => {
  const cost = +getArguments("/setMinWithdraw", ctx.message.text);
  if (isNaN(cost)) return;
  const result = config.setConfig("minWithdraw", cost);
  if (!result) return ctx.reply("❌");
  ctx.reply("✅");
});
bot.command("setChannel", isSuperAdmin, (ctx) => {
  const channelId = +getArguments("/setChannel", ctx.message.text);
  if (!channelId || isNaN(channelId)) return;
  const result = config.setConfig("channel", channelId);
  if (!result) return ctx.reply("❌");
  ctx.reply("✅");
});

function getArguments(command, text) {
  return text.slice(command.length + 1, text.length);
}
