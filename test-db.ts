import { db } from "./server/db";
import { abstracts, users } from "./shared/schema";
import { eq } from "drizzle-orm";

async function testDatabase() {
  try {
    console.log("Testing database connection...");
    
    // Test basic connection
    const userCount = await db.select().from(users);
    console.log(`Found ${userCount.length} users in database`);
    
    // Test abstracts table
    try {
      const abstractCount = await db.select().from(abstracts);
      console.log(`Found ${abstractCount.length} abstracts in database`);
    } catch (error) {
      console.error("Error querying abstracts table:", error);
    }
    
    // Test specific user abstracts query
    try {
      const testUserId = 2; // Based on logs, this user exists
      const userAbstracts = await db.select().from(abstracts).where(eq(abstracts.userId, testUserId));
      console.log(`Found ${userAbstracts.length} abstracts for user ${testUserId}`);
    } catch (error) {
      console.error("Error querying user abstracts:", error);
    }
    
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
