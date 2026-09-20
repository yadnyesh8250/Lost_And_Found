import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Claimed = sequelize.define("Claimed", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  identifyingDetails: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  lostLocation: {
    type: DataTypes.STRING,
    defaultValue: "",
  },

  lostDate: {
    type: DataTypes.DATE,
  },

  itemImage: {
    type: DataTypes.STRING,
    defaultValue: "",
  },

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },

  rejectReason: {
    type: DataTypes.STRING,
  },

}, {
  timestamps: true,
});

export default Claimed;