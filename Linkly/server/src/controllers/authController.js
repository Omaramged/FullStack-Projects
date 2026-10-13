import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function makeToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function safeUser(user) {
  return { _id: user._id, name: user.name, username: user.username, email: user.email };
}

export async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (username.length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    const emailLower = email.toLowerCase().trim();
    const exists = await User.findOne({ $or: [{ email: emailLower }, { username: username.trim() }] });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email or username already taken" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), username: username.trim(), email: emailLower, password: hashed });
    const token = makeToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.status(201).json({ success: true, message: "Account created", data: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const token = makeToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.json({ success: true, message: "Logged in", data: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", cookieOptions());
  res.json({ success: true, message: "Logged out", data: null });
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Current user", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function updateMe(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter a name" });
    }
    const user = await User.findByIdAndUpdate(req.userId, { name: name.trim() }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Profile updated", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
