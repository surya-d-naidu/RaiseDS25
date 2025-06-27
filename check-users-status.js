// Check all users and their email verification status
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function checkUsers() {
  try {
    // Get all users with their verification status
    const users = await sql`
      SELECT 
        id, 
        username, 
        email, 
        role, 
        email_verified,
        email_verification_token,
        email_verification_expires,
        created_at
      FROM users 
      ORDER BY created_at DESC;
    `;
    
    console.log('All users in database:');
    console.log('========================');
    
    if (users.length === 0) {
      console.log('No users found in database');
      return;
    }
    
    users.forEach(user => {
      console.log(`\nUser: ${user.username} (${user.email})`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Email Verified: ${user.email_verified ? '✓' : '✗'}`);
      console.log(`  Has Token: ${user.email_verification_token ? '✓' : '✗'}`);
      console.log(`  Token Expires: ${user.email_verification_expires || 'N/A'}`);
      console.log(`  Created: ${user.created_at}`);
    });
    
    const adminCount = users.filter(u => u.role === 'admin').length;
    const verifiedCount = users.filter(u => u.email_verified).length;
    
    console.log(`\nSummary:`);
    console.log(`  Total users: ${users.length}`);
    console.log(`  Admin users: ${adminCount}`);
    console.log(`  Verified users: ${verifiedCount}`);
    
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();
