import { User } from "../models/index.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email !== "temp1@gmail.com") {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(500).json({ message: "Server error during authorization" });
  }
};
