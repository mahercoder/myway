const { phone } = require("phone");
const { Scenes, Markup } = require("telegraf");
const db = require("../models");
const { getCaptcha, checkCaptcha, verifyOTP } = require("../utils/api");
const config = require("../utils/config");
const { texts, keyboardTexts } = require("../utils/constants");
const { addApiTask, removeTask } = require("../utils/queue");
const { getInitiativeLink } = require("../utils/generate");

const scene = new Scenes.WizardScene(
  "vote",
  async (ctx) => {
    const text = texts.vote.phone;
    const keyboard = Markup.keyboard([
      [Markup.button.contactRequest(keyboardTexts.vote.phone)],
      [keyboardTexts.common.back],
    ]).resize();
    await ctx.replyWithHTML(text, keyboard);
    ctx.wizard.state.tasks = [];
    ctx.wizard.next();
  },
  async (ctx) => {
    // validate and format phone
    let userPhone;
    if (ctx.message?.text) {
      const { isValid, phoneNumber } = phone(ctx.message.text, {
        country: "UZ",
      });
      if (isValid) {
        userPhone = phoneNumber;
      }
    } else if (ctx.message?.contact) {
      const { isValid, phoneNumber } = phone(ctx.message.contact.phone_number, {
        country: "UZ",
      });
      if (isValid) {
        userPhone = phoneNumber;
      }
    }
    if (!userPhone) {
      let text = texts.errors.invalidPhone;
      await ctx.reply(text);
      return;
    }
    userPhone = userPhone.substring(1, userPhone.length);
    let existing = await db.Vote.findOne({
      where: {
        phone: userPhone,
      },
    });
    if (!existing) {
      existing = await db.Phone.findOne({
        where: {
          number: userPhone,
        },
      });
    }
    if (existing) {
      await ctx.reply(texts.errors.phoneUsed);
      return ctx.scene.reenter();
    }

    ctx.wizard.state.phone = userPhone;

    await ctx.reply(texts.common.wait);
    const taskId = addApiTask(
      async () => await getCaptcha(),
      async (result) => {
        const { success, data, message } = result;
        if (!success) {
          await ctx.reply(message);
          return ctx.scene.reenter();
        }
        let imageData =
          data.image.substr(0, 100) + data.image.substr(132, data.image.length);
        const imageBuffer = Buffer.from(imageData, "base64");
        await ctx.replyWithPhoto({ source: imageBuffer });
        ctx.wizard.state.captchaKey = data.captchaKey;
        const keyboard = Markup.keyboard([keyboardTexts.common.back]).resize();
        await ctx.reply(texts.vote.solution, keyboard);
        ctx.wizard.next();
      }
    );
    ctx.wizard.state.tasks.push(taskId);
  },
  async (ctx) => {
    const solution = +ctx.message?.text;
    if (!solution) return await ctx.reply(texts.errors.invalidSolution);
    ctx.wizard.state.solution = solution;

    await ctx.reply(texts.common.wait);
    const taskId = addApiTask(
      async () =>
        await checkCaptcha(
          ctx.wizard.state.captchaKey,
          solution,
          ctx.wizard.state.phone
        ),
      async (result) => {
        const { success, data, message } = result;
        if (success || message === texts.errors.unknown) {
          const keyboard = Markup.inlineKeyboard([
            [
              Markup.button.webApp(
                keyboardTexts.vote.goVote,
                getInitiativeLink()
              ),
            ],
            [
              Markup.button.callback(
                keyboardTexts.vote.confirmVote,
                "confirm-vote"
              ),
            ],
          ]);
          await ctx.reply(texts.vote.voteAndReturn, keyboard);
          return ctx.wizard.next();
        }
        if (message === texts.errors.phoneUsed) {
          await db.Phone.create({
            number: ctx.wizard.state.phone,
          });
        }
        await ctx.reply(message);
        return ctx.scene.reenter();
      }
    );
    ctx.wizard.state.tasks.push(taskId);
  },
  async (ctx) => {
    const isConfirmation = ctx.callbackQuery?.data === "confirm-vote";
    if (!isConfirmation) {
      await ctx.reply(texts.errors.choose);
      ctx.answerCbQuery();
      return;
    }

    await ctx.deleteMessage();
    // get new captcha
    await ctx.reply(texts.common.wait);
    const taskId = addApiTask(
      async () => await getCaptcha(),
      async (result) => {
        const { success, data, message } = result;
        if (!success) {
          await ctx.reply(message);
          return ctx.scene.reenter();
        }
        let imageData =
          data.image.substr(0, 100) + data.image.substr(132, data.image.length);
        const imageBuffer = Buffer.from(imageData, "base64");
        await ctx.replyWithPhoto({ source: imageBuffer });
        ctx.wizard.state.captchaKey = data.captchaKey;
        const keyboard = Markup.keyboard([keyboardTexts.common.back]).resize();
        await ctx.reply(texts.vote.solution, keyboard);
        ctx.wizard.next();
      }
    );
    ctx.wizard.state.tasks.push(taskId);
  },
  async (ctx) => {
    const solution = +ctx.message?.text;
    if (!solution) return await ctx.reply(texts.errors.invalidSolution);
    ctx.wizard.state.solution = solution;

    await ctx.reply(texts.common.wait);
    // check whether he voted or not
    const taskId = addApiTask(
      async () =>
        await checkCaptcha(
          ctx.wizard.state.captchaKey,
          ctx.wizard.state.solution,
          ctx.wizard.state.phone
        ),
      async (result) => {
        const { success, data, message } = result;
        console.log(success, data, message);
        if (!success && message === texts.errors.phoneUsed) {
          await db.Phone.create({
            number: ctx.wizard.state.phone,
          });
          // voted successfully

          // TODO: transaction
          // Save vote
          const referrerId = ctx.scene.state.referrer || null;
          await db.Vote.create({
            userId: ctx.session.user.id,
            votedAt: Date.now(),
            referrerId,
            phone: ctx.wizard.state.phone,
          });
          // add vote cost to user's balance
          await db.User.update(
            {
              balance: (ctx.session.user.balance || 0) + config.voteCost,
            },
            {
              where: {
                id: ctx.session.user.id,
              },
            }
          );
          const user = await db.User.findOne({
            where: { id: ctx.session.user.id },
          });
          ctx.session.user = user;
          await ctx.reply(texts.vote.done);
          ctx.answerCbQuery();
          // Refer logic
          if (referrerId) {
            // add refer cost to balance of referrer
            const referrer = await db.User.findOne({
              where: { id: referrerId },
            });
            if (!referrer) throw new Error("Referrer couldn't be found!");
            await db.User.update(
              {
                balance: referrer.balance + config.referCost,
              },
              {
                where: {
                  id: referrer.id,
                },
              }
            );
            // send message about referred user to referrer
            await ctx.telegram.sendMessage(
              referrer.telegramId,
              texts.vote.referred(ctx.session.user.name)
            );
            //   send message about referrer to user
            await ctx.reply(texts.vote.referredBy(referrer.name));
          }
          // Go back to main menu
          ctx.scene.enter("start");
        } else {
          await ctx.reply(texts.errors.notVoted);
          ctx.answerCbQuery();
          ctx.scene.reenter();
        }
      }
    );
    ctx.wizard.state.tasks.push(taskId);
  }
);

scene.hears(keyboardTexts.common.back, (ctx) => ctx.scene.enter("start"));

module.exports = scene;
