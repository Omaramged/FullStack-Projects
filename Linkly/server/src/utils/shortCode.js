import crypto from "crypto";
import Link from "../models/Link.js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const RESERVED = ["api", "login", "register", "dashboard", "settings", "about", "health", "links", "analytics", "privacy", "terms"];

export function makeCode(length = 7) {
  let code = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

export function isValidUrl(value) {
  if (!value || value.length > 2048) return false;
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (!u.hostname || !u.hostname.includes(".")) return false;
    if (u.username || u.password) return false;
    return true;
  } catch {
    return false;
  }
}

export function isValidAlias(value) {
  if (!value) return true;
  if (value.length < 3 || value.length > 30) return false;
  if (RESERVED.includes(value.toLowerCase())) return false;
  return /^[A-Za-z0-9-_]+$/.test(value);
}

export async function uniqueCode(custom) {
  if (custom) {
    const found = await Link.findOne({ shortCode: custom });
    if (found) return null;
    return custom;
  }
  for (let i = 0; i < 5; i++) {
    const code = makeCode(7);
    const found = await Link.findOne({ shortCode: code });
    if (!found) return code;
  }
  return null;
}

export function isExpired(link) {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt).getTime() < Date.now();
}
