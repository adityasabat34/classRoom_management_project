import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
  console.log("🔄 Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
