import { db } from "./server/db";
import { users } from "./shared/schema";

async function checkAllUsers() {
  try {
    console.log("Checking all users in database...");
    const allUsers = await db.select().from(users);
    
    console.log(`Total users: ${allUsers.length}`);
    
    // Display all users (hiding passwords)
    allUsers.forEach(user => {
      const { password, ...safeUser } = user;
      console.log(safeUser);
    });
    
  } catch (error) {
    console.error("Error checking users:", error);
  }
}

checkAllUsers().then(() => process.exit(0));
