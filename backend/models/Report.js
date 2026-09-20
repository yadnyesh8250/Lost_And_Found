import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Report = sequelize.define("Report", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  reporterId: { type: DataTypes.INTEGER, allowNull: false }, // User filing the report
  itemId: { type: DataTypes.INTEGER }, // Target reported item
  reason: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" } // "pending", "resolved", "dismissed"
}, {
  timestamps: true,
});
export default Report;
