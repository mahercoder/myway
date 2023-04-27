"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
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
      this.belongsTo(models.User, {
        foreignKey: "referrerId",
      });
    }
  }
  Vote.init(
    {
      phone: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "userId",
        },
      },
      votedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: Sequelize.fn("NOW"),
      },
      referrerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "userId",
        },
      },
    },
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
