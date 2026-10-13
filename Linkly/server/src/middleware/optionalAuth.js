import jwt from "jsonwebtoken";

export default function optionalAuth(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch {}
  }
  next();
}
