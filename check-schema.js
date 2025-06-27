// Check current database schema
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function checkSchema() {
  try {
    // Check users table structure
    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Current users table columns:');
    result.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check if email verification columns exist
    const emailVerifiedExists = result.some(row => row.column_name === 'email_verified');
    const emailTokenExists = result.some(row => row.column_name === 'email_verification_token');
    const emailExpiresExists = result.some(row => row.column_name === 'email_verification_expires');
    
    console.log('\nEmail verification columns:');
    console.log('email_verified:', emailVerifiedExists ? '✓' : '✗');
    console.log('email_verification_token:', emailTokenExists ? '✓' : '✗');
    console.log('email_verification_expires:', emailExpiresExists ? '✓' : '✗');
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();
