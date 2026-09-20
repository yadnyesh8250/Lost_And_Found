import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const Item = sequelize.define("Item", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },

  category: {
    type: DataTypes.ENUM(
      "electronics","books","clothing","accessories","documents",
      "keys","wallet","bag","id_cards","mobile","laptop",
      "pets","jewelry","vehicles","other"
    ),
    allowNull: false,
  },
  
  identifier: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Serial Number, Student ID, or Unique Registration No"
  },

  type: {
    type: DataTypes.ENUM("lost", "found"),
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  images: {
    type: DataTypes.JSON,
  },

  status: {
    type: DataTypes.ENUM("active","claimed","resolved","expired"),
    defaultValue: "active",
  },

  expiryDate: {
    type: DataTypes.DATE,
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  claimedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Item;