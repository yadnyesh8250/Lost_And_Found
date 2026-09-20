import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

const AuditLog = sequelize.define("AuditLog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  action: { type: DataTypes.STRING, allowNull: false }, // e.g. "ITEM_DELETED", "CLAIM_APPROVED"
  entityType: { type: DataTypes.STRING, allowNull: false }, // e.g. "Item", "Claimed"
  entityId: { type: DataTypes.INTEGER, allowNull: false },
  performedBy: { type: DataTypes.INTEGER, allowNull: false }, // User/Admin ID doing the action
  details: { type: DataTypes.TEXT } // JSON stringified details of the change
}, {
  timestamps: true,
});
export default AuditLog;
