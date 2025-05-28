import { db } from "./db";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

async function updateCommitteeMembersTable() {
  console.log('Starting committee members table migration...');
  
  try {
    // Check if profile_link column exists
    const profileLinkExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='committee_members' AND column_name='profile_link'
    `);
    
    // Add profile_link column if it doesn't exist
    if (profileLinkExists.rows.length === 0) {
      console.log('Adding profile_link column...');
      await db.execute(sql`
        ALTER TABLE committee_members 
        ADD COLUMN profile_link TEXT
      `);
      console.log('Successfully added profile_link column');
    } else {
      console.log('profile_link column already exists');
    }
    
    // Check if image column exists
    const imageExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='committee_members' AND column_name='image'
    `);
    
    // Add image column if it doesn't exist
    if (imageExists.rows.length === 0) {
      console.log('Adding image column...');
      await db.execute(sql`
        ALTER TABLE committee_members 
        ADD COLUMN image TEXT
      `);
      console.log('Successfully added image column');
    } else {
      console.log('image column already exists');
    }
    
    console.log('Schema migration completed successfully');
  } catch (error) {
    console.error('Error during schema migration:', error);
  }
}

// Run the migration
updateCommitteeMembersTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
