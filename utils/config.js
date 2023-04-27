require("dotenv").config();
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../config.json");

// const config = {
//   production: 1,
//   token: "6243514161:AAEYKoHBqHL--n1yHIzrwtfcgbqpi3-uha4",
//   initiativeId: "5b75bc25-2c28-4233-90a2-2424f8c3a6d6",
//   channel: -1001989439578,
//   voteCost: 4000,
//   referCost: 200,
//   admins: [543588222,792684458],
//   minWithdraw: 4000,
//   apiRate: 1000,
// };

const config = require("../config.json");

config.setConfig = function (key, value) {
  let data = fs.readFileSync(configPath);
  if (!data) return false;
  data = JSON.parse(data);
  data[key] = value;
  data = JSON.stringify(data);
  fs.writeFileSync(configPath, data);
  config[key] = value;
  return config;
};

module.exports = config;
