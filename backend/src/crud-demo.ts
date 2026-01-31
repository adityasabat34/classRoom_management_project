import { eq } from "drizzle-orm";
import { db } from "./config/db";
import { demoUsers } from "./config/schema";

async function main() {
  try {
    console.log("🚀 Performing CRUD operations...\n");

    // CREATE: Insert a new user
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: "Admin User", email: "admin@example.com" })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    console.log("✅ CREATE: New user created:");
    console.log(newUser);
    console.log();

    // READ: Select the user
    const foundUser = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, newUser.id));
    console.log("✅ READ: Found user:");
    console.log(foundUser[0]);
    console.log();

    // UPDATE: Change the user's name
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: "Super Admin" })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    console.log("✅ UPDATE: User updated:");
    console.log(updatedUser);
    console.log();

    // DELETE: Remove the user
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log("✅ DELETE: User deleted.");
    console.log();

    console.log("🎉 CRUD operations completed successfully!");
  } catch (error) {
    console.error("❌ Error performing CRUD operations:", error);
    process.exit(1);
  }
}

main();
