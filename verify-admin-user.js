// Verify admin user email
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function verifyAdmin() {
  try {
    // Update admin user to be verified
    const result = await sql`
      UPDATE users 
      SET 
        email_verified = true,
        email_verification_token = null,
        email_verification_expires = null
      WHERE role = 'admin' AND username = 'surya-d-naidu'
      RETURNING id, username, email, role, email_verified;
    `;
    
    if (result.length > 0) {
      console.log('Admin user verified successfully:');
      console.log(result[0]);
    } else {
      console.log('No admin user found to verify');
    }
    
  } catch (error) {
    console.error('Error verifying admin:', error);
  }
}

verifyAdmin();
