const { session } = require("telegraf");
const bot = require("./core/bot");
const auth = require("./middlewares/auth");
const checkSession = require("./middlewares/checkSession");
const isAdmin = require("./middlewares/isAdmin");
const isPrivate = require("./middlewares/isPrivate");
const isChannel = require("./middlewares/isChannel");
const isChannelAdmin = require("./middlewares/isChannelAdmin");
const stage = require("./scenes");
const logger = require("./utils/logger");
const { handlePaidPayments } = require("./actions/channel.actions");
const useRef = require("./middlewares/useRef");
const {
  handleInlineReferral,
} = require("./inline-queries/referal.inline-query");

const rateLimit = require('telegraf-ratelimit')
 
// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => (ctx, next) => setTimeout( () => next(), 3000)
}

bot.use(rateLimit(limitConfig))

// Register middlewares
bot.use(session());
bot.use(checkSession);
bot.use(auth);
bot.use(stage.middleware());

// Base case
bot.start(isPrivate, useRef, (ctx) => ctx.scene.enter("start"));

bot.command("admin", isPrivate, isAdmin, (ctx) => ctx.scene.enter("dashboard"));

require("./commands/superadmin");

bot.on("text", isPrivate, (ctx) => ctx.scene.enter("start"));

// Handle channel actions
bot.action(/paid_(.+)/, isChannel, isChannelAdmin, handlePaidPayments);

bot.inlineQuery("referal", handleInlineReferral);

// Handle global errors
bot.catch((error) => {
  logger.error("Bot Error:", { message: error.message });
});
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", { reason });
});
process.on("uncaughtException", (reason) => {
  logger.error("Uncaught Exception:", { reason });
});

// Launch. TODO: webhook
bot.launch({ dropPendingUpdates: true }).catch((reason) => {
  logger.error("Bot can't be started", { reason });
  process.exit(1);
});
logger.info("Bot started!");
