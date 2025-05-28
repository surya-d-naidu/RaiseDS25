import { db } from "./server/db";
import { users } from "./shared/schema";

async function verifyAdmin() {
  try {
    const allUsers = await db.select().from(users);
    console.log(`Total users in database: ${allUsers.length}`);
    
    // Display all users (hiding passwords)
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    console.log("User accounts:", JSON.stringify(safeUsers, null, 2));
    
  } catch (error) {
    console.error("Error verifying admin accounts:", error);
  }
}

verifyAdmin().then(() => process.exit(0));
