import express from "express";
import auth from "../middleware/auth.js";
import Link from "../models/Link.js";
import Click from "../models/Click.js";

const router = express.Router();

router.get("/overview", auth, async (req, res) => {
  try {
    const range = req.query.range || "7d";
    let days = 7;
    if (range === "30d") days = 30;
    if (range === "90d") days = 90;
    if (range === "all") days = 3650;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const links = await Link.find({ user: req.userId });
    const ids = links.map((l) => l._id);
    const totalLinks = links.length;
    const activeLinks = links.filter((l) => l.isActive).length;
    const now = Date.now();
    const expiredLinks = links.filter((l) => l.expiresAt && new Date(l.expiresAt).getTime() < now).length;
    let totalClicks = 0;
    links.forEach((l) => (totalClicks += l.clickCount || 0));

    const clicks = await Click.find({ link: { $in: ids }, clickedAt: { $gte: since } });
    const byDay = {};
    clicks.forEach((c) => {
      const day = new Date(c.clickedAt).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const chart = Object.keys(byDay).sort().map((d) => ({ date: d, clicks: byDay[d] }));

    const base = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
    const topLinks = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5).map((l) => ({
      _id: l._id,
      title: l.title,
      originalUrl: l.originalUrl,
      shortCode: l.shortCode,
      shortUrl: base + "/" + l.shortCode,
      clickCount: l.clickCount,
      isActive: l.isActive,
      createdAt: l.createdAt,
    }));

    const recentClicks = await Click.find({ link: { $in: ids } }).sort({ clickedAt: -1 }).limit(10).populate("link", "shortCode originalUrl title");

    res.json({
      success: true,
      message: "Overview loaded",
      data: { totalLinks, totalClicks, activeLinks, expiredLinks, chart, topLinks, recentClicks },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default router;
