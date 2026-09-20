import { Item, User, Claimed, Karma, AuditLog, Notification, Report } from "../models/index.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const createItem = async (req, res) => {
  try {
    const images = [];

    if (req.file) {
      try {
        const url = await uploadOnCloudinary(req.file.path);
        images.push(url);
      } catch (uploadErr) {
        // If Cloudinary fails or not configured, fall back to serving the local file from /public
        console.error("Image upload failed, falling back to local file:", uploadErr.message);
        if (req.file && req.file.filename) {
          const localUrl = `${req.protocol}://${req.get("host")}/public/${encodeURIComponent(req.file.filename)}`;
          images.push(localUrl);
        }
      }
    }

    const item = await Item.create({
      ...req.body,
      images,
      postedBy: req.userId,
    });

    res.json({ item });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ message: "Failed to create item", error: error.message });
  }
};


export const getAllItems = async (req, res) => {
  const items = await Item.findAll({
    include: [
      { model: User, as: "postedByUser", attributes: ["id", "name", "email"] },
      { model: User, as: "claimedByUser", attributes: ["id", "name", "profileImage"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({ items });
};


export const resolveItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ONLY the owner can resolve their own item
    if (item.postedBy !== req.userId) {
      return res.status(403).json({ message: "Only the owner can resolve this item" });
    }

    await Item.update(
      { status: "resolved", claimedBy: null }, // Resolution doesn't necessarily mean a claimant, but let's clear it
      { where: { id: req.params.id } }
    );
    
    // Also, if it's a found item and we are resolving, mark any pending claims as rejected
    if (item.type === "found") {
       await Claimed.update(
         { status: "rejected", rejectReason: "Item was resolved by the owner." },
         { where: { itemId: item.id, status: "pending" } }
       )
    }

    res.json({ message: "Item resolved successfully", status: "resolved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve item" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    await Item.update(req.body, {
      where: { id: req.params.id },
    });

    const updatedItem = await Item.findByPk(req.params.id);
    res.json({ item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update item" });
  }
};


export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Item.destroy({ where: { id: req.params.id } });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};


export const createClaimRequest = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // BUSINESS LOGIC: Item must be active to receive claims
    if (item.status !== "active") {
      return res.status(400).json({ message: "This item is no longer available for new claims." });
    }

    // BUSINESS LOGIC: You can't claim your own item
    if (item.postedBy === req.userId) {
      return res.status(400).json({ message: "You cannot interact with your own post." });
    }

    // BUSINESS LOGIC: Prevent duplicate claims by same user for same item
    const existing = await Claimed.findOne({ where: { itemId: req.params.id, claimant: req.userId } });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted a claim for this item." });
    }

    let itemImage = "";
    if (req.file) {
      try {
        const url = await uploadOnCloudinary(req.file.path);
        itemImage = url;
      } catch (uploadErr) {
        if (req.file && req.file.filename) {
          itemImage = `${req.protocol}://${req.get("host")}/public/${encodeURIComponent(req.file.filename)}`;
        }
      }
    }

    const payload = { ...req.body };
    if (!payload.lostDate || payload.lostDate.trim() === "") {
      payload.lostDate = null;
    }

    const claim = await Claimed.create({
      ...payload,
      itemId: req.params.id,
      claimant: req.userId,
      itemImage,
    });

    res.json({ claim });
  } catch (error) {
    console.error("Create claim error:", error);
    res.status(500).json({ message: "Failed to submit claim", error: error.message });
  }
};

export const getClaimRequests = async (req, res) => {
  try {
    const claims = await Claimed.findAll({
      include: [
        {
          model: Item,
          as: "item",
          where: { postedBy: req.userId },
        },
        {
          model: User,
          as: "claimantUser",
          attributes: ["id", "name", "email", "phone"],
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json({ claims });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

import { Op } from "sequelize";

export const updateClaimScore = async (req, res) => {
  try {
    const { status, rejectReason } = req.body;
    const claimId = req.params.id;

    const claim = await Claimed.findByPk(claimId, { include: { model: Item, as: "item" } });
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // BUSINESS LOGIC: Only the item OWNER can approve or reject claims setup for their item
    if (claim.item.postedBy !== req.userId) {
      return res.status(403).json({ message: "Only the item owner can approve or reject claims." });
    }

    // Update the targeted claim
    await Claimed.update({ status, rejectReason }, { where: { id: claimId } });

    // BUSINESS LOGIC: If a claim is APPROVED, transition the item and reject others
    if (status === "approved" && claim?.item) {
      // SUCCESS SYNC: Mark the item as claimed and record WHO recovered it
      await Item.update(
        { status: "claimed", claimedBy: claim.claimant },
        { where: { id: claim.itemId } }
      );

      // ORGANIC DBMS GENERATION: Karma, AuditLog, Notification
      
      // 1. AuditLog: Track the critical state transition
      await AuditLog.create({
        action: "CLAIM_APPROVED",
        entityType: "Item",
        entityId: claim.itemId,
        performedBy: req.userId,
        details: `Item #${claim.itemId} returned successfully. Claim #${claim.id} approved.`,
      });

      // 2. Karma: Reward the user who posted the item for helping out
      await Karma.create({
        userId: claim.item.postedBy,
        points: 15,
        reason: `Successfully resolved and returned item: ${claim.item.title}`,
      });

      // 3. Notification: Alert the claimant
      await Notification.create({
        userId: claim.claimant,
        title: "Claim Approved!",
        message: `Your claim for "${claim.item.title}" was approved by the owner! Check your messages to coordinate pickup.`,
        type: "success",
      });

      // Conflict rejection: reject all other pending claims for this item
      await Claimed.update(
        { status: "rejected", rejectReason: "Another claim was approved for this item." },
        { where: { 
            itemId: claim.itemId, 
            status: "pending",
            id: { [Op.ne]: req.params.id }
          } 
        }
      );
    }

    res.json({ claim });
  } catch (error) {
    console.error("updateClaimScore error:", error);
    res.status(500).json({ message: "Failed to update claim" });
  }
};

export const getMyClaims = async (req, res) => {
  // Claims made by the current user
  const claims = await Claimed.findAll({
    where: { claimant: req.userId },
    include: {
      model: Item,
      as: "item",
      include: {
        model: User,
        as: "postedByUser",
        attributes: ["id", "name", "email", "phone"],
      }
    },
    order: [["createdAt", "DESC"]],
  });

  res.json({ claims });
};

export const createReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;
    
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const report = await Report.create({
      itemId: id,
      reporterId: req.userId,
      reason: reason || "Inappropriate Content",
      details: details,
      status: "pending"
    });

    res.json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
};