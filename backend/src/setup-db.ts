import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log("🧹 Cleaning up old schema...");

    // Drop the old cars table if it exists
    await sql`DROP TABLE IF EXISTS cars CASCADE`;
    console.log("✅ Dropped old cars table");

    // Create the demo_users table
    await sql`
      CREATE TABLE IF NOT EXISTS demo_users (
        id serial PRIMARY KEY NOT NULL,
        name text NOT NULL,
        email text NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        CONSTRAINT demo_users_email_unique UNIQUE(email)
      )
    `;
    console.log("✅ Created demo_users table");

    console.log("\n🎉 Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
