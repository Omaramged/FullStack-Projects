import mongoose, { Schema, Document, Model } from "mongoose";
export interface ITicket extends Document {
  bookingId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  ticketTypeId: mongoose.Types.ObjectId;
  attendeeId: mongoose.Types.ObjectId;
  ticketCode: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const ticketSchema = new Schema<ITicket>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticketTypeId: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    attendeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ticketCode: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
  },
  { timestamps: true }
);
ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ ticketCode: 1 }, { unique: true });
export const Ticket: Model<ITicket> = mongoose.model<ITicket>("Ticket", ticketSchema);