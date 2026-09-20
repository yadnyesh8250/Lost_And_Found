import sequelize from "../config/DB.js";
import User from "./User.js";
import Item from "./Item.js";
import Claimed from "./claimed.models.js";
import Message from "./message.model.js";
import Conversation from "./Conversation.model.js";

// Import NEW models
import Category from "./Category.js";
import Location from "./Location.js";
import Notification from "./Notification.js";
import Announcement from "./Announcement.js";
import Report from "./Report.js";
import AuditLog from "./AuditLog.js";
import Karma from "./Karma.js";

/* Core relations for lost-and-found + messaging */

// User ↔ Item
User.hasMany(Item, { foreignKey: "postedBy", as: "items" });
Item.belongsTo(User, { foreignKey: "postedBy", as: "postedByUser" });
Item.belongsTo(User, { foreignKey: "claimedBy", as: "claimedByUser" });

// User ↔ Claimed
User.hasMany(Claimed, { foreignKey: "claimant", as: "claims" });
Claimed.belongsTo(User, { foreignKey: "claimant", as: "claimantUser" });

// Item ↔ Claimed
Item.hasMany(Claimed, { foreignKey: "itemId", as: "claimRequests" });
Claimed.belongsTo(Item, { foreignKey: "itemId", as: "item" });

// Messages
User.hasMany(Message, { foreignKey: "sender", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "receiver", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "sender", as: "senderUser" });
Message.belongsTo(User, { foreignKey: "receiver", as: "receiverUser" });

// Optional: Further relations for new tables can be defined here
// E.g. User.hasMany(Karma)
User.hasMany(Karma, { foreignKey: "userId", as: "karmaPoints" });
Karma.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Report, { foreignKey: "reporterId", as: "filedReports" });
Report.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });

Item.hasMany(Report, { foreignKey: "itemId", as: "reports" });
Report.belongsTo(Item, { foreignKey: "itemId" });

export {
  sequelize,
  User,
  Item,
  Claimed,
  Message,
  Conversation,
  Category,
  Location,
  Notification,
  Announcement,
  Report,
  AuditLog,
  Karma
};