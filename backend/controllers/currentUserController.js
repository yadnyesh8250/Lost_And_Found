import { User } from "../models/index.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const currentUser = async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
};

export const updateProfile = async (req, res) => {
  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.phone) updateData.phone = req.body.phone;

  if (req.file) {
    const url = await uploadOnCloudinary(req.file.path);
    updateData.profileImage = url;
  }

  await User.update(updateData, {
    where: { id: req.userId },
  });

  const user = await User.findByPk(req.userId);

  res.json({ user });
};