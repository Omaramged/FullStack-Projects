import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  link: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  clickedAt: { type: Date, default: Date.now },
  referrer: { type: String, default: "" },
  deviceType: { type: String, default: "unknown" },
  browser: { type: String, default: "unknown" },
  os: { type: String, default: "unknown" },
});

const Click = mongoose.model("Click", clickSchema);

export default Click;
