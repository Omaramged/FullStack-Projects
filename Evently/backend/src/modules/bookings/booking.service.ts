import crypto from "crypto";
import QRCode from "qrcode";
import { Booking } from "../../models/Booking";
import { Ticket } from "../../models/Ticket";
import { TicketType } from "../../models/TicketType";
import { Event } from "../../models/Event";
import { Notification } from "../../models/Notification";

export async function createBooking(attendeeId: string, data: { eventId: string; ticketTypeId: string; quantity: number }) {
  const event = await Event.findById(data.eventId);
  if (!event || event.status !== "published") { const e = new Error("Event not available") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  const tt = await TicketType.findById(data.ticketTypeId);
  if (!tt || tt.eventId.toString() !== data.eventId) { const e = new Error("Ticket type not found") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  const available = tt.quantity - tt.sold;
  if (data.quantity > available) { const e = new Error("Not enough tickets available") as Error & { statusCode: number }; e.statusCode = 400; throw e; }

  const totalPrice = tt.price * data.quantity;
  const bookingCode = crypto.randomBytes(8).toString("hex");
  const booking = await Booking.create({
    attendeeId, eventId: data.eventId, ticketTypeId: data.ticketTypeId,
    quantity: data.quantity, totalPrice, status: "confirmed", bookingCode,
  });

  // update sold count
  tt.sold += data.quantity;
  await tt.save();

  // create tickets with QR
  const tickets = [];
  for (let i = 0; i < data.quantity; i++) {
    const ticketCode = crypto.randomBytes(12).toString("hex");
    const qrData = JSON.stringify({ ticketCode, eventId: data.eventId, bookingId: booking._id.toString() });
    const qrCode = await QRCode.toDataURL(qrData);
    const ticket = await Ticket.create({
      bookingId: booking._id, eventId: data.eventId, ticketTypeId: data.ticketTypeId,
      attendeeId, ticketCode, qrCode, checkedIn: false,
    });
    tickets.push(ticket);
  }

  // notify organizer
  await Notification.create({
    userId: event.organizerId,
    title: "New booking",
    message: `${data.quantity} ticket(s) booked for ${event.title}`,
    type: "booking",
  });

  return { booking, tickets };
}

export async function getMyBookings(attendeeId: string) {
  return Booking.find({ attendeeId })
    .populate("eventId", "title startDate startTime location eventType")
    .populate("ticketTypeId", "name price")
    .sort({ createdAt: -1 });
}

export async function getBookingById(id: string, userId: string, role: string) {
  const booking = await Booking.findById(id)
    .populate("eventId")
    .populate("ticketTypeId")
    .populate("attendeeId", "name email");
  if (!booking) return null;
  if (role === "attendee" && booking.attendeeId._id.toString() !== userId) return null;
  const tickets = await Ticket.find({ bookingId: booking._id });
  return { booking, tickets };
}

export async function cancelBooking(id: string, attendeeId: string) {
  const booking = await Booking.findOne({ _id: id, attendeeId });
  if (!booking) { const e = new Error("Booking not found") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  if (booking.status === "cancelled") { const e = new Error("Already cancelled") as Error & { statusCode: number }; e.statusCode = 400; throw e; }
  booking.status = "cancelled";
  await booking.save();
  // restore sold count
  const tt = await TicketType.findById(booking.ticketTypeId);
  if (tt) { tt.sold = Math.max(0, tt.sold - booking.quantity); await tt.save(); }
  // mark tickets
  await Ticket.updateMany({ bookingId: booking._id }, { checkedIn: false });
  return booking;
}

export async function checkInTicket(ticketCode: string, organizerId: string) {
  const ticket = await Ticket.findOne({ ticketCode }).populate("eventId");
  if (!ticket) { const e = new Error("Ticket not found") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  const event = ticket.eventId as unknown as { organizerId: { toString: () => string } };
  if (event.organizerId.toString() !== organizerId) { const e = new Error("Not authorized for this event") as Error & { statusCode: number }; e.statusCode = 403; throw e; }
  const booking = await Booking.findById(ticket.bookingId);
  if (!booking || booking.status !== "confirmed") { const e = new Error("Booking not confirmed") as Error & { statusCode: number }; e.statusCode = 400; throw e; }
  if (ticket.checkedIn) { const e = new Error("Ticket already checked in") as Error & { statusCode: number }; e.statusCode = 400; throw e; }
  ticket.checkedIn = true;
  ticket.checkedInAt = new Date();
  await ticket.save();
  // mark booking attended if all tickets checked? keep simple
  return ticket;
}

export async function manualLookup(ticketCode: string, organizerId: string) {
  return checkInTicket(ticketCode, organizerId);
}

export async function getEventAttendees(eventId: string, organizerId: string) {
  const event = await Event.findOne({ _id: eventId, organizerId });
  if (!event) { const e = new Error("Event not found or not owned") as Error & { statusCode: number }; e.statusCode = 404; throw e; }
  const bookings = await Booking.find({ eventId }).populate("attendeeId", "name email").populate("ticketTypeId", "name");
  return bookings;
}