import mongoose, { Schema, Document, Model } from "mongoose";
export type BookingStatus = "confirmed" | "cancelled" | "attended";
export interface IBooking extends Document {
  attendeeId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  ticketTypeId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  bookingCode: string;
  createdAt: Date;
  updatedAt: Date;
}
const bookingSchema = new Schema<IBooking>(
  {
    attendeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ticketTypeId: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["confirmed", "cancelled", "attended"], default: "confirmed" },
    bookingCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
bookingSchema.index({ attendeeId: 1, createdAt: -1 });
bookingSchema.index({ eventId: 1 });
export const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);