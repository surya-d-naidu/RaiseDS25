import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function fixFullPaperUpload() {
  try {
    console.log('🔧 Fixing full paper upload issues...');

    // Create full_papers table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "full_papers" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "abstract_id" integer,
        "title" text NOT NULL,
        "abstract" text NOT NULL,
        "keywords" text NOT NULL,
        "authors" json,
        "corresponding_author" text NOT NULL,
        "paper_file" text NOT NULL,
        "original_filename" text NOT NULL,
        "file_size" integer,
        "mime_type" text,
        "track_id" integer,
        "status" text DEFAULT 'pending' NOT NULL,
        "submission_date" timestamp DEFAULT now(),
        "last_modified" timestamp DEFAULT now()
      );
    `);

    // Add foreign key constraints
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "full_papers" ADD CONSTRAINT "full_papers_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "full_papers" ADD CONSTRAINT "full_papers_abstract_id_abstracts_id_fk" 
        FOREIGN KEY ("abstract_id") REFERENCES "public"."abstracts"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('✅ Full papers table created/updated successfully');

    // Check if uploads directory exists and create if not
    const fs = await import('fs');
    const path = await import('path');
    
    const uploadsDir = path.join(process.cwd(), 'uploads', 'full-papers');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Full papers upload directory created');
    }

    console.log('🎉 Full paper upload fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing full paper upload:', error);
    throw error;
  }
}

// Run the fix
fixFullPaperUpload().catch(console.error);