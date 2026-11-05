import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import app from "./app";

async function start(): Promise<void> {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`HireHub API running on http://localhost:${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});