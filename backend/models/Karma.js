import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Karma = sequelize.define("Karma", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // User who earned points
  points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  reason: { type: DataTypes.STRING, allowNull: false } // e.g. "Returned lost wallet"
}, {
  timestamps: true,
});
export default Karma;
