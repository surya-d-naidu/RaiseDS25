import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addInvitedSpeakersTable() {
  const client = await pool.connect();
  try {
    // Check if table already exists
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'invited_speakers'
    `);
    
    if (result.rows.length === 0) {
      console.log("Creating invited_speakers table...");
      await client.query(`
        CREATE TABLE invited_speakers (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          title TEXT NOT NULL,
          position TEXT NOT NULL,
          institution TEXT NOT NULL,
          country TEXT NOT NULL,
          bio TEXT,
          expertise TEXT,
          image TEXT,
          linkedin_url TEXT,
          website_url TEXT,
          talk_title TEXT,
          talk_abstract TEXT,
          is_keynote BOOLEAN DEFAULT false,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("invited_speakers table created successfully!");
    } else {
      console.log("invited_speakers table already exists");
    }
    
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

addInvitedSpeakersTable();
