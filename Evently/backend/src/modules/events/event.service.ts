import { Event } from "../../models/Event";
import { TicketType } from "../../models/TicketType";

export async function createEvent(organizerId: string, data: Record<string, unknown>) {
  return Event.create({ ...data, organizerId });
}
export async function getEventById(id: string) {
  return Event.findById(id).populate("organizerId", "name email");
}
export async function listEvents(query: Record<string, unknown>) {
  const filter: Record<string, unknown> = { status: "published" };
  if (query.search) filter.title = new RegExp(String(query.search), "i");
  if (query.category) filter.category = new RegExp(String(query.category), "i");
  if (query.from) filter.startDate = { ...(filter.startDate as object), $gte: new Date(String(query.from)) };
  if (query.to) filter.startDate = { ...(filter.startDate as object), $lte: new Date(String(query.to)) };
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Event.find(filter).populate("organizerId", "name").sort({ startDate: 1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}
export async function listOrganizerEvents(organizerId: string) {
  return Event.find({ organizerId }).sort({ createdAt: -1 });
}
export async function updateEvent(id: string, organizerId: string, data: Record<string, unknown>) {
  const event = await Event.findOneAndUpdate({ _id: id, organizerId }, { $set: data }, { new: true });
  if (!event) { const e = new Error("Event not found or not owned") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  return event;
}
export async function deleteEvent(id: string, organizerId: string) {
  const res = await Event.deleteOne({ _id: id, organizerId });
  if (res.deletedCount === 0) { const e = new Error("Event not found or not owned") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  await TicketType.deleteMany({ eventId: id });
}
export async function getEventTicketTypes(eventId: string) {
  return TicketType.find({ eventId });
}
export async function createTicketType(eventId: string, organizerId: string, data: { name: string; description?: string; price: number; quantity: number }) {
  const event = await Event.findOne({ _id: eventId, organizerId });
  if (!event) { const e = new Error("Event not found or not owned") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  return TicketType.create({ ...data, eventId, sold: 0 });
}