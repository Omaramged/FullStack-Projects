import mongoose, { Schema, Document, Model } from "mongoose";
export interface ITicketType extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  createdAt: Date;
  updatedAt: Date;
}
const ticketTypeSchema = new Schema<ITicketType>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);
ticketTypeSchema.index({ eventId: 1 });
export const TicketType: Model<ITicketType> = mongoose.model<ITicketType>("TicketType", ticketTypeSchema);