import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addProfileColumn() {
  const client = await pool.connect();
  try {
    // Check if column already exists
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'profile_picture_url'
    `);
    
    if (result.rows.length === 0) {
      console.log("Adding profile_picture_url column to users table...");
      await client.query("ALTER TABLE users ADD COLUMN profile_picture_url text");
      console.log("Column added successfully!");
    } else {
      console.log("Column profile_picture_url already exists");
    }
    
    // Also add accommodation columns if they don't exist
    const ageResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'accommodation_requests' AND column_name = 'age'
    `);
    
    if (ageResult.rows.length === 0) {
      console.log("Adding age column to accommodation_requests table...");
      await client.query("ALTER TABLE accommodation_requests ADD COLUMN age integer NOT NULL DEFAULT 0");
      console.log("Age column added successfully!");
    }
    
    const genderResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'accommodation_requests' AND column_name = 'gender'
    `);
    
    if (genderResult.rows.length === 0) {
      console.log("Adding gender column to accommodation_requests table...");
      await client.query("ALTER TABLE accommodation_requests ADD COLUMN gender text NOT NULL DEFAULT 'prefer-not-to-say'");
      console.log("Gender column added successfully!");
    }
    
  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

addProfileColumn();
