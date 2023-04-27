const config = require('./config');

function getRandomNumber() {
  var t = 10,
    n = 5;
  return parseInt(Math.random() * (t - n) + n);
}

function parseUTF16(t, n, e, i, a) {
  return btoa("s" + t + "e" + n + "k" + e + "r" + i + "e" + a + "t");
}

function generateAccessCaptcha() {
  var t = 12;
  return parseUTF16(
    getRandomNumber() * t,
    getRandomNumber() * t,
    getRandomNumber() * t,
    getRandomNumber() * t,
    getRandomNumber() * t
  );
}

function getInitiativeLink() {
  return `https://openbudget.uz/boards-list/2/${config.initiativeId}`;
}

function generateInitiativeId(link) {
  return link.substring(36, link.length);
}

module.exports = {
  generateAccessCaptcha,
  generateInitiativeId,
  getInitiativeLink
};
