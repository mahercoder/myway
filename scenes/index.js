const { Scenes } = require("telegraf");
const isPrivate = require("../middlewares/isPrivate");
const useRef = require("../middlewares/useRef");

const stage = new Scenes.Stage([
  require("./start"),
  require("./wallet"),
  require("./withdraw"),
  require("./vote"),
  require("./admin"),
  require('./broadcast'),
  require("./changeInitiative"),
]);

stage.start(isPrivate, useRef, (ctx) => ctx.scene.enter("start"));

module.exports = stage;
