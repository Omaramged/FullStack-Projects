import { User } from "../../models/User";
import { Event } from "../../models/Event";
import { Booking } from "../../models/Booking";

export async function getStats() {
  const [users, events, bookings] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Booking.countDocuments(),
  ]);
  return { users, events, bookings };
}
export async function listUsers() {
  return User.find().select("-password").sort({ createdAt: -1 });
}
export async function listEvents() {
  return Event.find().populate("organizerId", "name email").sort({ createdAt: -1 });
}
export async function deleteUser(id: string) {
  await User.deleteOne({ _id: id });
}
export async function deleteEvent(id: string) {
  await Event.deleteOne({ _id: id });
  await (await import("../../models/TicketType")).TicketType.deleteMany({ eventId: id });
}