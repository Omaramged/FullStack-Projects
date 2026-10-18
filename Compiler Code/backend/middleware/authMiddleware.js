const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please log in first" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Please log in first" });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired, please log in again" });
  }
}

module.exports = authMiddleware;
