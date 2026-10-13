import mongoose from "mongoose";
import Link from "../models/Link.js";
import Click from "../models/Click.js";
import { isValidUrl, isValidAlias, uniqueCode, isExpired } from "../utils/shortCode.js";

function shortUrl(req, code) {
  const base = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
  return base + "/" + code;
}

function checkId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid link id" });
    return false;
  }
  return true;
}

export async function createLink(req, res) {
  try {
    const { originalUrl, title, customAlias, expiresAt } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ success: false, message: "Please enter a URL" });
    }
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ success: false, message: "Please enter a valid http or https URL" });
    }
    if (!isValidAlias(customAlias)) {
      return res.status(400).json({ success: false, message: "Alias must be 3-30 chars, letters numbers - _ only" });
    }
    let date = null;
    if (expiresAt) {
      date = new Date(expiresAt);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid expiration date" });
      }
      if (date.getTime() < Date.now()) {
        return res.status(400).json({ success: false, message: "Expiration date must be in the future" });
      }
    }
    const code = await uniqueCode(customAlias ? customAlias.trim() : null);
    if (!code) {
      return res.status(400).json({ success: false, message: "That alias is already taken" });
    }
    const link = await Link.create({
      originalUrl,
      shortCode: code,
      user: req.userId || null,
      title: title || "",
      expiresAt: date,
    });
    res.status(201).json({
      success: true,
      message: "Short link created",
      data: { ...link.toObject(), shortUrl: shortUrl(req, link.shortCode) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function listLinks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "newest";
    const status = req.query.status || "all";

    let filter = { user: req.userId };
    if (search) {
      filter.$or = [
        { originalUrl: { $regex: search, $options: "i" } },
        { shortCode: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    let sortBy = { createdAt: -1 };
    if (sort === "oldest") sortBy = { createdAt: 1 };
    if (sort === "clicks") sortBy = { clickCount: -1 };

    const total = await Link.countDocuments(filter);
    const links = await Link.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);

    const now = Date.now();
    const items = links.map((l) => {
      const obj = l.toObject();
      obj.shortUrl = shortUrl(req, l.shortCode);
      obj.expired = l.expiresAt ? new Date(l.expiresAt).getTime() < now : false;
      return obj;
    });

    let filtered = items;
    if (status === "expired") filtered = items.filter((x) => x.expired);

    res.json({
      success: true,
      message: "Links loaded",
      data: { links: filtered, total, page, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function getLink(req, res) {
  try {
    if (!checkId(req.params.id, res)) return;
    const link = await Link.findOne({ _id: req.params.id, user: req.userId });
    if (!link) return res.status(404).json({ success: false, message: "Link not found" });
    const obj = link.toObject();
    obj.shortUrl = shortUrl(req, link.shortCode);
    obj.expired = isExpired(link);
    res.json({ success: true, message: "Link loaded", data: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function updateLink(req, res) {
  try {
    if (!checkId(req.params.id, res)) return;
    const { originalUrl, title, expiresAt } = req.body;
    const link = await Link.findOne({ _id: req.params.id, user: req.userId });
    if (!link) return res.status(404).json({ success: false, message: "Link not found" });
    if (originalUrl) {
      if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ success: false, message: "Please enter a valid http or https URL" });
      }
      link.originalUrl = originalUrl;
    }
    if (title !== undefined) link.title = title;
    if (expiresAt !== undefined) {
      if (!expiresAt) {
        link.expiresAt = null;
      } else {
        const date = new Date(expiresAt);
        if (isNaN(date.getTime())) {
          return res.status(400).json({ success: false, message: "Invalid expiration date" });
        }
        link.expiresAt = date;
      }
    }
    await link.save();
    const obj = link.toObject();
    obj.shortUrl = shortUrl(req, link.shortCode);
    res.json({ success: true, message: "Link updated", data: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function deleteLink(req, res) {
  try {
    if (!checkId(req.params.id, res)) return;
    const link = await Link.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!link) return res.status(404).json({ success: false, message: "Link not found" });
    await Click.deleteMany({ link: link._id });
    res.json({ success: true, message: "Link deleted", data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function setStatus(req, res) {
  try {
    if (!checkId(req.params.id, res)) return;
    const link = await Link.findOne({ _id: req.params.id, user: req.userId });
    if (!link) return res.status(404).json({ success: false, message: "Link not found" });
    link.isActive = !link.isActive;
    if (typeof req.body.isActive === "boolean") link.isActive = req.body.isActive;
    await link.save();
    const obj = link.toObject();
    obj.shortUrl = shortUrl(req, link.shortCode);
    res.json({ success: true, message: link.isActive ? "Link activated" : "Link deactivated", data: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function linkAnalytics(req, res) {
  try {
    if (!checkId(req.params.id, res)) return;
    const link = await Link.findOne({ _id: req.params.id, user: req.userId });
    if (!link) return res.status(404).json({ success: false, message: "Link not found" });
    const range = req.query.range || "7d";
    let days = 7;
    if (range === "30d") days = 30;
    if (range === "90d") days = 90;
    if (range === "all") days = 3650;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const clicks = await Click.find({ link: link._id, clickedAt: { $gte: since } }).sort({ clickedAt: -1 }).limit(50);
    const byDay = {};
    const all = await Click.find({ link: link._id, clickedAt: { $gte: since } });
    all.forEach((c) => {
      const day = new Date(c.clickedAt).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const chart = Object.keys(byDay).sort().map((d) => ({ date: d, clicks: byDay[d] }));
    res.json({
      success: true,
      message: "Analytics loaded",
      data: {
        link: { ...link.toObject(), shortUrl: shortUrl(req, link.shortCode) },
        totalClicks: link.clickCount,
        chart,
        recentClicks: clicks,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
