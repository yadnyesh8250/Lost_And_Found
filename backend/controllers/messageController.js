import { Conversation, Message, User, sequelize } from "../models/index.js";
import { Op } from "sequelize";
import { getReciverSocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver } = req.params;
    const senderId = Number(req.userId);
    const receiverId = Number(receiver);

    if (!receiver || Number.isNaN(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver id" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: req.body.message,
      image: req.body.image || ""
    });

    // Efficient conversation lookup: participants must contain both IDs
    // participants is a JSON field [id1, id2]
    let conversation = await Conversation.findOne({
      where: {
        [Op.and]: [
          sequelize.fn('JSON_CONTAINS', sequelize.col('participants'), JSON.stringify(senderId)),
          sequelize.fn('JSON_CONTAINS', sequelize.col('participants'), JSON.stringify(receiverId))
        ]
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [senderId, receiverId] });
    }

    // BROADCAST REAL-TIME MESSAGE
    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
       // Send the message directly to the recipient's socket
       io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};


export const getMessage = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const receiverId = Number(req.params.receiver);

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.json({ messages });
  } catch (error) {
    console.error("getMessage error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const getConversations = async (req, res) => {
  // Fetch all conversations and filter where current user is a participant
  const convos = await Conversation.findAll();

  const filtered = convos.filter((c) => {
    try {
      const parts = c.participants || [];
      return parts.map((p) => Number(p)).includes(Number(req.userId));
    } catch (e) {
      return false;
    }
  });

  res.json({ conversations: filtered });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [Op.ne]: req.userId } },
      attributes: ["id", "name", "email", "profileImage"],
    });

    res.json({ users });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};