import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.log("Missing MONGODB_URI in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.log("Missing JWT_SECRET in .env");
  process.exit(1);
}

await connectDB(process.env.MONGODB_URI);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
