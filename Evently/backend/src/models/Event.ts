import mongoose, { Schema, Document, Model } from "mongoose";
export type EventType = "online" | "in-person";
export type EventStatus = "draft" | "published" | "cancelled";
export interface IEvent extends Document {
  organizerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  coverImage?: string;
  category: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  eventType: EventType;
  capacity: number;
  registrationDeadline?: Date;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}
const eventSchema = new Schema<IEvent>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, default: "General" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    eventType: { type: String, enum: ["online", "in-person"], default: "in-person" },
    capacity: { type: Number, required: true, min: 1 },
    registrationDeadline: { type: Date },
    status: { type: String, enum: ["draft", "published", "cancelled"], default: "draft" },
  },
  { timestamps: true }
);
eventSchema.index({ organizerId: 1 });
eventSchema.index({ status: 1, startDate: 1 });
export const Event: Model<IEvent> = mongoose.model<IEvent>("Event", eventSchema);