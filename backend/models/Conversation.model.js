import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Conversation = sequelize.define("Conversation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  participants: {
    type: DataTypes.JSON, // store userIds array
    allowNull: false,
  },

}, {
  timestamps: true,
});

export default Conversation;