import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Please login first" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Session expired, please login again" });
  }
}
