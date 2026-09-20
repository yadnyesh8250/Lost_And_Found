import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Location = sequelize.define("Location", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  zone: { type: DataTypes.STRING }, // e.g. "A Wing", "Boys Hostel"
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
});
export default Location;
