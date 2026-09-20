import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Announcement = sequelize.define("Announcement", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.INTEGER, allowNull: false }, // User ID of Admin
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
});
export default Announcement;
