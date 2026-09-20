import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Message = sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  receiver: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
  },

  image: {
    type: DataTypes.STRING,
    defaultValue: "",
  },

}, {
  timestamps: true,
});

export default Message;