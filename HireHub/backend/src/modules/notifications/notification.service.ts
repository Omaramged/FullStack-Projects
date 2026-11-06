import { Notification } from "../../models/Notification";

export async function listNotifications(userId: string) {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
}

export async function markRead(id: string, userId: string) {
  const n = await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true });
  if (!n) {
    const err = new Error("Notification not found") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  return n;
}

export async function markAllRead(userId: string) {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
}