// Simple script to check users in database
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL);

async function checkUsers() {
  try {
    console.log("Checking users in database...");
    
    // Check if users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    
    console.log("Users table exists:", tableExists[0].exists);
    
    if (tableExists[0].exists) {
      // Get all users
      const users = await sql`SELECT id, username, email, role, email_verified FROM users ORDER BY created_at DESC;`;
      console.log(`Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Email Verified: ${user.email_verified}`);
      });
    }
    
  } catch (error) {
    console.error("Error checking users:", error);
  }
}

checkUsers();
