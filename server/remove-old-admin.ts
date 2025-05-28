// Remove the old admin account with username "admin"
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function removeOldAdmin() {
  try {
    console.log("Checking for old admin user account...");
    
    // Check if old admin account exists
    const oldAdminUser = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
    
    if (oldAdminUser.length > 0) {
      console.log("Found old admin account with username 'admin', removing...");
      
      // Delete the old admin account
      const result = await db.delete(users).where(eq(users.username, "admin")).returning();
      
      if (result.length > 0) {
        console.log("✅ Successfully removed old admin account");
      } else {
        console.log("❌ Failed to remove old admin account");
      }
    } else {
      console.log("No admin user found with username 'admin'");
    }
    
    // Verify new admin account exists
    const newAdminUser = await db.select().from(users).where(eq(users.username, "surya-d-naidu")).limit(1);
    
    if (newAdminUser.length > 0) {
      const { password, ...safeUser } = newAdminUser[0];
      console.log("✅ Confirmed new admin user exists:", safeUser);
    } else {
      console.error("❌ WARNING: New admin user 'surya-d-naidu' not found!");
    }
    
    // Count total users in the database
    const allUsers = await db.select().from(users);
    console.log(`Total users after cleanup: ${allUsers.length}`);
    
  } catch (error) {
    console.error("Error removing old admin account:", error);
    process.exit(1);
  }
}

// Only run when called directly, not when imported
if (import.meta.url === `file://${process.argv[1]}`) {
  removeOldAdmin().then(() => {
    process.exit(0);
  });
}
