import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedAdminUser() {
  try {
    console.log("Checking for admin user...");
    
    // Check if admin user exists
    const adminUser = await db.select().from(users).where(eq(users.username, "admin")).execute();
    
    if (adminUser.length === 0) {
      console.log("Creating default admin user...");
      
      // Create admin user
      await db.insert(users).values({
        username: "admin",
        email: "admin@raiseds25.com",
        password: await hashPassword("admin123"),
        firstName: "Admin",
        lastName: "User",
        institution: "VIT-AP University",
        role: "admin"
      }).execute();
      
      console.log("Default admin user created successfully!");
      console.log("Username: admin");
      console.log("Password: admin123");
    } else {
      console.log("Admin user already exists, skipping creation.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

// Run when imported
seedAdminUser();