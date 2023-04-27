const axios = require("axios").default;
const config = require("./config");
const { texts } = require("./constants");
const { generateAccessCaptcha } = require("./generate");
const logger = require("./logger");

const apiUrl = "https://openbudget.uz/api/v2/";

const api = axios.create({
  baseURL: apiUrl,
  proxy: false,
  timeout: 120000,
});

const xsrfToken = "3d130eb1-234c-4743-9700-e9d8fdf34b57";
api.defaults.headers["x-xsrf-token"] = xsrfToken;
api.defaults.headers["cookie"] = `XSRF-TOKEN=${xsrfToken}; Path=/;`;

async function getCaptcha() {
  try {
    const { status, data } = await api.get("/vote/captcha-2", {
      withCredentials: true,
      headers: {
        // "Access-Captcha": "czM2ZTE4MGsxMDhyMTA4ZTEyOHQ=",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        Referer: `https://openbudget.uz/boards-list/1/${config.initiativeId}`,
        "Access-Captcha": generateAccessCaptcha(),
      },
    });
    if (status === 200) {
      return { success: true, data };
    } else {
      logger.error("API Error: Get captcha returned different status", {
        status,
        data,
      });
      return { success: false, message: texts.errors.unknown };
    }
  } catch (err) {
    logger.error("API Error: Can't get captcha", {
      message: err.message,
    });
    return { success: false, message: getMessageFromError(err) };
  }
}

async function checkCaptcha(
  captchaKey,
  captchaResult,
  phoneNumber,
  boardId = 2
) {
  try {
    console.log("entering");
    const { status, data } = await api.post(
      "/vote/check",
      {
        captchaKey,
        captchaResult,
        phoneNumber,
        boardId,
      },
      {
        withCredentials: true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
          Referer: `https://openbudget.uz/boards-list/1/${config.initiativeId}`,
        },
      }
    );
    console.log("status", status, data)
    if (status === 200) {
      return { success: true, data };
    } else {
      logger.error(
        "API Error: Check captcha/Send SMS returned different status",
        {
          status,
          data,
        }
      );
      return { success: false, message: texts.errors.unknown };
    }
  } catch (err) {
    logger.error("API Error: Can't check captcha/send sms", {
      message: err.message || err.response?.data?.message,
    });
    return { success: false, message: getMessageFromError(err) };
  }
}

const reCaptchaResponse = "03AKH6MRF_Yo9KumM7qA3P4k-06hSI4iBb35aFAw9_zJniE0NiTHt-wWUxmRYBbRqvZUqfrpzrTluc3Qf6vrL6VRhrbd7BZ8OBEQ-6iVtgBoltrvmZJQTO0M7gYXOmJNfyVwCLKfgPu_BUBhi0A6qnkH1HKcw7xRyroBPbIYUh6audBMsDSKKiqvbxyJeq7gg5ZESODvezQxuzLeWOb1o8aTLDSdrEcqXmEpgkiEvm9gmTbqUmqnp7geiScBwLjm8fqvRfc8oFS-a_PcgAnCXHZSVJLiHVJsFT9vOi6wy1UzLeBshMMwZlQWfZVgNjx_dSH3b2Npho2R4IouuEGMHAMGqDIy6qGIlmF8P8ZJ7qwayCRZR9juGwNdibfa8qYU4cZi-lVjxUdy9JV1fvPdIhTMgAVfMbfQsAoXfczZybNFBoU7xJKVsf6V6_3ZAKTci6cO4enHB7Duo6nbenWBIM8CGuyTFl_x44VRALJgDThaJOwBw_FuIaV7JPeBi3Iy75XG1GiU7BTEFghPDH9TuG2yKvT3KcL_cTZ2XrYLmDlEtGiv4yZXItAGIJbmXx5JEQpNOljEpk_UpANHZ_saY53Kceh_diR-mXsJeS8VpJUMMGczmmDLpdZtoQrrS8UP2kmrIw1OODQJP5mpZyrDb2CLMGY_AYgAieK-WYvS_v-SW6If0TSqx3O9X2T3RBhd_VBMFaawkZ-YwbtqEU2ZZaVTgEjU2BLCvWvagINpvA70Jqh9c7L32Iw83j3L764-6S1JbK2FJM4ud1Y03_8fSe9uPeMAZOwtJ7vAuhjqMSY0XrRfyIa9atv3B-dPa0lkXAnGxe4YSbfqv-6Ld1OLBPbnb4EqiXg5h5SiTJAFTId7OV_m7HbhLVss3ptmL83Lbjai4L-QSILPt4odLT7wkqc34JKUxB2fjjI27YTTha7JZmVoTKqLms4NBTJLuq-USgN0BHJ1UPFLBtRjTdukZBWqjeMu3mvKM9JcXolD5Bv7kiCcQlCcgHq0CiE8pIAxfyGaRb6PSdIl2eGkaTb4BOx8JQoePeYf7d3L1o6w5EBU3ZM3Z2Te6_peuwfmUHyXabRYrENr2BpxOshSZFJKXy26o6mGNvJ3eGyaTGv79BQaPrhu4FIUA-MAeIBbWZxbJe6Kss_eSdktE8L5QY4Un0VUFxjRMSOtNIj8pQqJR3uGza4o6GdaBvRAv5E3aXhfFhXUTwyyXjMVQn2tW3RlEFikUFQfkt4Atcjv-K7Xi_kTLc-qk6mLforDwoKLBKV5rHEQ7ghZr7pJiByRhiulWyQDIrZQbIpvEATQ";

async function verifyOTP(otpKey, otpCode, initiativeId) {
  try {
    const { status, data } = await api.post("/vote/verify-2", {
      otpKey,
      otpCode,
      initiativeId,
      reCaptchaResponse,
      subinitiativesId: [],
    });
    if (status === 200) {
      return { success: true };
    } else {
      logger.error("API Error: Verify SMS returned different status", {
        status,
        data,
      });
      return { success: false, message: texts.errors.unknown };
    }
  } catch (err) {
    logger.error("API Error: Can't Verify sms", {
      message: err.message,
    });
    return { success: false, message: getMessageFromError(err) };
  }
}

function getMessageFromError(error) {
  if (error?.code === "ECONNABORTED") {
    return texts.errors.load;
  }
  switch (error?.response?.data?.code) {
    case 102:
      return texts.errors.expired;
    case 103:
      return texts.errors.invalidSolution;
    case 108:
      return texts.errors.invalidCode;
    case 112:
      return texts.errors.phoneUsed;
    default:
      return texts.errors.unknown;
  }
}

module.exports = {
  getCaptcha,
  checkCaptcha,
  verifyOTP,
};
