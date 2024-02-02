const Sequelize = require("sequelize");
const sequelize = require("../connections/database");
const Chats = sequelize.define(
  "chat",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isImage: {
      type: Sequelize.BOOLEAN,
    },
    date_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
  }
);
module.exports = Chats;
