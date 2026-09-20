import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: { type: DataTypes.STRING, allowNull: false },

  email: { type: DataTypes.STRING, allowNull: false, unique: true },

  phone: { type: DataTypes.STRING, defaultValue: "" },

  password: { type: DataTypes.STRING, defaultValue: "" },

  profileImage: { type: DataTypes.STRING, defaultValue: "" },

  theme: { type: DataTypes.ENUM("light", "dark"), defaultValue: "light" },

  role: { type: DataTypes.STRING, defaultValue: "user" },
}, {
  timestamps: true,
});

export default User;
