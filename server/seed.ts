import { db, pool } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  try {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString("hex")}.${salt}`;
    
    // Verify the hash format is correct
    const [hash, saltPart] = hashedPassword.split('.');
    if (!hash || !saltPart || hash.length === 0 || saltPart.length === 0) {
      throw new Error('Generated password hash has invalid format');
    }
    
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Creating database tables if they don't exist...");
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        institution TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
      // Create abstracts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS abstracts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        authors TEXT NOT NULL,
        keywords TEXT NOT NULL,
        reference_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        file_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create profiles table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        bio TEXT,
        position TEXT,
        department TEXT,
        country TEXT,
        profile_picture_url TEXT,
        is_presenter BOOLEAN DEFAULT FALSE,
        is_committee_member BOOLEAN DEFAULT FALSE,
        social_links JSONB
      )
    `);
    
    // Create invitations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'pending',
        message TEXT,
        sender_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      )
    `);
    
    // Create notifications table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'general',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP
      )
    `);
    
    // Create committee_members table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS committee_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        institution TEXT,
        country TEXT,
        category TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        "order" INTEGER DEFAULT 0
      )
    `);
    
    // Create research_awards table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS research_awards (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        amount TEXT,
        deadline TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

async function setupDatabase() {
  try {
    // Create tables if they don't exist
    await createTables();
    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

// Run when imported
setupDatabase();