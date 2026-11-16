import mongoose, { Schema, Document, Model } from "mongoose";
export type UserRole = "attendee" | "organizer" | "admin";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["attendee", "organizer", "admin"], default: "attendee" },
    avatar: { type: String },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);