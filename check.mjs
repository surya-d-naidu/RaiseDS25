import { db } from "./dist/db.js";
import { users } from "./dist/shared/schema.js";

async function check() {
  try {
    const allUsers = await db.select().from(users);
    console.log(`Total users: ${allUsers.length}`);
    console.log(JSON.stringify(allUsers, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

check();
