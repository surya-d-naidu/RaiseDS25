import { db } from "./server/db";
import { users } from "./shared/schema";

async function checkAdmin() {
  try {
    console.log("Checking admin users in database...");
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role
    }).from(users);
    
    console.log(`Total users: ${allUsers.length}`);
    console.log(allUsers);
  } catch (error) {
    console.error("Error checking admin users:", error);
  }
}

checkAdmin().then(() => process.exit(0));
