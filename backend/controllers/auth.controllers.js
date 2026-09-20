import { getToken } from "../config/token.js";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export const GoogleRegister = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, phone });

    const token = await getToken(user.id);

    // Set cookie; in production we set sameSite:none and secure=true for cross-site cookies
    res.cookie("token", token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({ message: "Account created", user, token });
  } catch (error) {
    res.status(500).json({ message: "Google register error" });
  }
};

export const GoogleLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = await getToken(user.id);

    res.cookie("token", token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });

    res.json({ message: "Login success", user, token });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};

export const Register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
    });

    const token = await getToken(user.id);

    res.cookie("token", token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Register error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = await getToken(user.id);

    res.cookie("token", token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: "Logged out" });
};

export const updateTheme = async (req, res) => {
  const { theme } = req.body;

  await User.update({ theme }, { where: { id: req.userId } });

  const user = await User.findByPk(req.userId);

  res.json({ theme: user.theme });
};