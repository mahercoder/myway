const config = require("./config");

const texts = {
  common: {
    wait: "⏳",
    referralButton: "🗳 Men uchun ovoz bering!",
    referralAd: (link) =>
      `🤩👇 Quyidagi botga kirib men uchun ovoz bering va har bir ovoz uchun pul yutug'iga ega bo'lamiz! 👇`,
  },
  start: {
    info: "🗳 Bot OpenBudget platformasida ovoz berish jarayonini telegram orqali yo'lga qo'yish va uni osonlashtirish maqsadida tuzilgan.",
    enter:
      "🗳 Marhamat, ovoz berish yoki sizga kerakli bo'limni tanlashingiz mumkin!",
    referral: (link) =>
      `✨ Quyidagi referal havolangizni do'stlaringizga ulashish orqali balansingizga qo'shimcha mablag' olishingiz mumkin!\n\n🔗 ${link}`,
    shareReferral: "📤 Havolani ulashish",
  },
  wallet: {
    balance: (amount) => `💵 Hamyoningizda ${amount} so'm mablag' mavjud.`,
    withdraw: {
      detail: (type) =>
        type === "phone"
          ? "📞 Iltimos, pulni o'tkazmoqchi bo'lgan telefon raqamini kiriting."
          : "💳 Iltimos, pulni o'tkazmoqchi bo'lgan kartangiz raqamini yuboring.",
      amount: "⚖️ Marhamat, chiqarib olmoqchi bo'lgan pul miqdorini kiriting.",
      applied:
        "✅ Juda yaxshi! Sizning hisobingizga kiritilgan mablag' tez orada o'tkaziladi!\n😉 Hamkorligingiz uchun tashakkur!",
      paid: (type) =>
        `🎉 Siz so'rov yuborgan miqdordagi mablag' ${
          type === "phone" ? "telefongingizga" : "kartangizga"
        } o'tkazildi!\n😉 Keyingi faoliyatingizda ham omad!`,
    },
    paymentInfo: (payment) =>
      `${payment.type === "phone" ? "📞 Telefon raqam" : "💳 Karta raqam"}: ${
        payment.detail
      }\n💵 Pul miqdori: ${payment.amount} so'm\n${
        payment.isPaid ? "✅ To'langan" : "⏳ Pending\n\n#pending"
      }`,
  },
  vote: {
    voteAndReturn:
      "✔️ Marhamat, quyidagi tugma orqali ovoz bering va keyin botga qaytib ovoz berganingizni tasdiqlang.",
    phone:
      "Ovoz berish uchun telefon raqamingizni jo'nating yoki yozib yuboring.\nMisol: <b>902883434</b>",
    solution: "🟰 Iltimos, ushbu matematik masalaga javob bering",
    code: "📧 SMS orqali qabul qilingan kodni kiriting",
    done: "✅ Ovozingiz qabul qilindi. Ishtirokingiz uchun rahmat!",
    referred: (name) =>
      `🥳 Sizning referal havolangiz orqali ${name} botimizda ovoz berdi!\n💸 Buning uchun sizning balansingizga referal narxi qo'shib qo'yildi!`,
    referredBy: (name) =>
      `🥳 Siz ${name} nomli foydalanuvchimiz referal havolasidan foydalanib ovoz berganingiz uchun uning balansi referal narxiga to'ldirildi!\n✅ Siz ham do'stlaringizni taklif qilish orqali balansingizni to'ldirishingiz mumkin! Buning uchun "Referal" bo'limini tanlang.`,
  },
  errors: {
    unknown:
      "⚠️ Kutilmagan xatolik kelib chiqdi.\n✔️ Iltimos, yana urinib ko'ring!",
    invalidPhone:
      "⚠️ Kechirasiz, siz yuborgan telefon raqam orqali ovoz berishning iloji yo'q.\n✔️ Boshqa telefon raqam bilan ovoz berishingiz mumkin!",
    load: "😓 Ayni paytda OpenBudget platformasi juda ko'p yuklama bilan ishlamoqda.\n✔️ Iltimos, yana urinib ko'ring.",
    expired:
      "❗️ Yechim yoki kodning yaroqlilik muddati tugagan.\n✔️ Yana urinib ko'rishingiz mumkin.",
    invalidSolution:
      "🙁 Kechirasiz, siz yuborgan yechim mos kelmadi.\n✔️ Yana urinib ko'rishingiz mumkin!",
    invalidCode:
      "☹️ Kechirasiz, ushbu kod mos kelmadi.\n✔️ Iltimos, faqat raqamlardan iborat to'g'ri sms kodni yuboring!",
    phoneUsed:
      "☹️ Afsuski, bu raqamdan allaqachon ovoz berish uchun foydalanilgan.\n✔️ Boshqa raqam kiritib urinib ko'rishingiz mumkin!",

    invalidValue:
      "❗️ Iltimos, kiritilgan ma'lumot to'g'ri ekaniga ishonch hosil qiling!",
    notEnoughBalance:
      "❗️ Sizning, hisobingizda kiritilgan miqdordagi mablag' mavjud emas!",
    lessThanMin: `❗️ Kiritilgan summa minimal summadan kam!\nMinimal summa: ${config.minWithdraw} so'm`,
    choose: "❗️ Iltimos keltirilganlardan birini tanlang!",
    notVoted: "❌ Kiritgan telefon raqamiz orqali ovoz berilmagan!\n✅ Iltimos ovoz berib, so'ngra urinib ko'ring.",
  },
  admin: {
    enter:
      "🤴 Admin panelga xush kelibsiz! Quyidagilardan keraklisini tanlashingiz mumkin.",
    statistics: ({
      votes,
      votesFee,
      refers,
      refersFee,
      payments: { paid, total, paidFee, totalFee },
    }) =>
      `📊 Bot statistikasi:\n\n🗳 Ovozlar soni: ${votes}\n💰 Ovozlar uchun kerakli mablag': ${votesFee} so'm\n\n👥 Referallar soni: ${refers}\n💵 Referallar uchun kerakli mablag': ${refersFee} so'm\n\n✅ Amalga oshirilgan to'lovlar: ${paid}/${total}\n💰 Amalga oshirilgan to'lovlar summasi: ${paidFee}/${totalFee} so'm`,
    broadcast: {
      enter:
        "✍️ Marhamat barcha foydalanuvchilarga yuborilishi kerak bo'lgan xabarni qoldirishingiz mumkin!",
      done: "✅ Xabar botning barcha foydalanuvchilariga yuborildi!",
    },
    changeInitiative: {
      enter: () =>
        `🔗 Marhamat, tashabbus havolasini yuboring. Tashabbus havolasi quyidagi formatda bo'lishi kerak!\n\Hozirgi tashabbus: https://openbudget.uz/boards-list/1/${config.initiativeId}`,
      done: "✅ Botdan ovoz beriladigan tashabbus yangilandi!",
    },
  },
};

const keyboardTexts = {
  start: {
    vote: "🗳 Ovoz berish",
    info: "ℹ️ Bot haqida",
    wallet: "💰 Hamyon",
    referral: "🔗 Mening referalim",
    withdraw: "🔄 Pul yechib olish",
  },
  common: {
    back: "◀️ Orqaga",
  },
  wallet: {
    phone: "📞 Telefonga o'tkazish",
    card: "💳 Plastik kartaga o'tkazish",
    paymentDone: "✅ To'landi",
  },
  vote: {
    phone: "📞 Telefon raqam yuborish",
    confirmVote: "✅ Tasdiqlash",
    goVote: "🗳 Ovoz berish",
  },
  admin: {
    statistics: "📊 Statistika",
    leave: "🚪 Admin paneldan chiqish",
    broadcast: "🗣 Barchaga e'lon",
    changeInitiative: "🔄 Tashabbusni o'zgartirish",
  },
};

module.exports = {
  texts,
  keyboardTexts,
};
