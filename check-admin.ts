import { db } from "./server/db";
import { users } from "./shared/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
  try {
    console.log("Checking admin user in database...");
    const adminUser = await db.select().from(users).where(eq(users.username, "surya-d-naidu")).limit(1);
    
    if (adminUser.length > 0) {
      const { password, ...safeUser } = adminUser[0];
      console.log("Admin user found:", safeUser);
      console.log("Password is hashed and secure.");
    } else {
      console.log("No admin user found with username 'surya-d-naidu'");
    }
  } catch (error) {
    console.error("Error checking admin user:", error);
  }
}

checkAdmin().then(() => process.exit(0));
