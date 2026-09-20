import sequelize from "../config/DB.js";
import { User, Item, Claimed, Message, Conversation, Category, Location, Notification, Announcement, Report, AuditLog, Karma } from "../models/index.js";

// Mapping string names to model instances
const modelsMap = {
  users: User,
  items: Item,
  claimeds: Claimed,
  messages: Message, // Kept here just in case Admin pulls it manually
  conversations: Conversation,
  categories: Category,
  locations: Location,
  notifications: Notification,
  announcements: Announcement,
  reports: Report,
  auditlogs: AuditLog,
  karmas: Karma
};

// Generic table fetcher
export const getTableData = async (req, res) => {
  try {
    const { tableName } = req.params;
    
    const Model = modelsMap[tableName.toLowerCase()];
    if (!Model) {
      return res.status(400).json({ message: "Invalid table name specified." });
    }

    // Exclude password from User model query
    const options = {
      order: [["createdAt", "DESC"]],
      limit: 500
    };

    if (tableName.toLowerCase() === 'users') {
      options.attributes = { exclude: ['password'] };
    }

    const data = await Model.findAll(options);
    res.json({ data });
  } catch (error) {
    console.error("Admin table fetch error:", error);
    res.status(500).json({ message: "Failed to fetch table data", error: error.message });
  }
};

// Generic entry creator (for announcements, categories, locations)
export const createEntry = async (req, res) => {
  try {
    const { tableName } = req.params;
    const WRITABLE = ["categories", "locations", "announcements"];

    if (!WRITABLE.includes(tableName.toLowerCase())) {
      return res.status(403).json({ message: "This table is read-only from admin panel." });
    }

    const Model = modelsMap[tableName.toLowerCase()];
    if (!Model) return res.status(400).json({ message: "Invalid table name." });

    // Inject admin's userId for announcements
    const payload = { ...req.body };
    if (tableName.toLowerCase() === "announcements") {
      payload.authorId = req.userId;
    }

    const created = await Model.create(payload);
    res.status(201).json({ message: "Created successfully", data: created });
  } catch (error) {
    console.error("Admin create error:", error);
    res.status(500).json({ message: "Creation failed", error: error.message });
  }
};

// Generic entry deleter
export const deleteEntry = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const DELETABLE = ["categories", "locations", "announcements", "reports", "items"];

    if (!DELETABLE.includes(tableName.toLowerCase())) {
      return res.status(403).json({ message: "This table cannot be deleted from the admin panel." });
    }

    const Model = modelsMap[tableName.toLowerCase()];
    if (!Model) return res.status(400).json({ message: "Invalid table name." });

    const deleted = await Model.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Record not found." });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Admin delete error:", error);
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

// ACADEMIC DBMS DEMONSTRATION: Advanced Raw SQL Queries
export const getAdvancedAnalytics = async (req, res) => {
  try {
    // 1. Group BY & Join for Top Karma Users
    const karmaLeaderboard = await sequelize.query(`
      SELECT u.id, u.name, SUM(k.points) as totalKarma
      FROM Users u
      JOIN Karmas k ON u.id = k.userId
      GROUP BY u.id, u.name
      ORDER BY totalKarma DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    // 2. Correlated Subquery for Items with abnormal claim numbers
    const itemClaimStats = await sequelize.query(`
      SELECT i.id, i.title, i.type, 
             (SELECT COUNT(*) FROM Claimeds c WHERE c.itemId = i.id) as claimCount
      FROM Items i
      WHERE (SELECT COUNT(*) FROM Claimeds c WHERE c.itemId = i.id) > 0
      ORDER BY claimCount DESC
    `, { type: sequelize.QueryTypes.SELECT });

    // 3. Multi-table Join for Resolution Matrix
    const resolutionMatrix = await sequelize.query(`
      SELECT i.title, p.name as postedBy, c.name as claimedBy, cl.status, cl.createdAt as claimDate
      FROM Claimeds cl
      JOIN Items i ON cl.itemId = i.id
      JOIN Users p ON i.postedBy = p.id
      JOIN Users c ON cl.claimant = c.id
      WHERE cl.status = 'approved'
      ORDER BY cl.createdAt DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      karmaLeaderboard,
      itemClaimStats,
      resolutionMatrix
    });
  } catch (error) {
    console.error("Advanced analytics error:", error);
    res.status(500).json({ message: "Failed to fetch complex analytics", error: error.message });
  }
};
