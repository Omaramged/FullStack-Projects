import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import app from "./app";
async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`Evently API running on http://localhost:${env.PORT}`));
}
start().catch((e) => { console.error("Failed to start:", e); process.exit(1); });