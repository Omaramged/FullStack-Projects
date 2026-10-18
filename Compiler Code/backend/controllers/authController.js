const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function sendAuthResponse(res, user) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ error: "This email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    return sendAuthResponse(res, user);
  } catch (err) {
    console.error("Register failed:", err.message);
    return res.status(500).json({ error: "Could not create your account, please try again" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    return sendAuthResponse(res, user);
  } catch (err) {
    console.error("Login failed:", err.message);
    return res.status(500).json({ error: "Could not log you in, please try again" });
  }
}

async function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
}

module.exports = { register, login, me };
