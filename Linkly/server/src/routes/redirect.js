import express from "express";
import Link from "../models/Link.js";
import Click from "../models/Click.js";
import { isExpired } from "../utils/shortCode.js";

const router = express.Router();

function fail(req, res, status, message) {
  const accept = req.headers.accept || "";
  if (accept.includes("text/html")) {
    const home = process.env.CLIENT_URL || "http://localhost:3000";
    return res.status(status).send(
      "<div style='font-family:Arial;text-align:center;padding:60px 20px;'>" +
        "<h1>Linkly</h1><p>" + message + "</p>" +
        "<a href='" + home + "'>Go to Linkly home</a></div>"
    );
  }
  return res.status(status).json({ success: false, message });
}

router.get("/:shortCode", async (req, res) => {
  try {
    const code = req.params.shortCode;
    const link = await Link.findOne({ shortCode: code });
    if (!link) {
      return fail(req, res, 404, "Short link not found");
    }
    if (!link.isActive) {
      return fail(req, res, 410, "This link has been deactivated");
    }
    if (isExpired(link)) {
      return fail(req, res, 410, "This link has expired");
    }
    const ua = req.headers["user-agent"] || "";
    let deviceType = "desktop";
    if (/mobile/i.test(ua)) deviceType = "mobile";
    if (/tablet/i.test(ua)) deviceType = "tablet";
    let browser = "unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    let os = "unknown";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "Mac";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
    else if (ua.includes("Linux")) os = "Linux";

    try {
      await Click.create({
        link: link._id,
        referrer: req.headers.referer || "",
        deviceType,
        browser,
        os,
      });
      link.clickCount += 1;
      link.lastClickedAt = new Date();
      await link.save();
    } catch (e) {
      console.log("Click save failed: " + e.message);
    }
    return res.redirect(302, link.originalUrl);
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default router;
