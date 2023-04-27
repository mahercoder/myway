const { Telegraf } = require("telegraf");
const config = require("../utils/config");

const bot = new Telegraf(config.token);

module.exports = bot;