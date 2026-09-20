import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // User receiving the notification
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: "system" }, // "alert", "claim_update", "system"
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true,
});
export default Notification;
