import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    clickCount: { type: Number, default: 0, min: 0 },
    lastClickedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

export default Link;
