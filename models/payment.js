"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Payment.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "userId",
        },
      },
      type: DataTypes.STRING,
      detail: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      isPaid: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
