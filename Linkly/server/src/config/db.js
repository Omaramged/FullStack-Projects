import mongoose from "mongoose";

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB error: " + err.message);
    process.exit(1);
  }
}
