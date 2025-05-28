// Creates or updates the admin user account with specified credentials
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

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

async function createOrUpdateAdmin() {
  try {
    console.log("Setting up admin user account...");
    
    // Admin credentials
    const adminCredentials = {
      username: "surya-d-naidu",
      password: await hashPassword("7075052734"),
      email: "admin@raiseds25.org",
      firstName: "Surya",
      lastName: "Naidu",
      institution: "VIT-AP",
      role: "admin"
    };
    
    // Check if admin account already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, adminCredentials.username)).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists, updating credentials...");
      await db.update(users)
        .set({
          password: adminCredentials.password,
          email: adminCredentials.email,
          firstName: adminCredentials.firstName,
          lastName: adminCredentials.lastName,
          institution: adminCredentials.institution,
          role: adminCredentials.role
        })
        .where(eq(users.username, adminCredentials.username));
      console.log("Admin user updated successfully!");
    } else {
      console.log("Creating new admin user...");
      await db.insert(users).values(adminCredentials);
      console.log("Admin user created successfully!");
    }
    
  } catch (error) {
    console.error("Error setting up admin account:", error);
    process.exit(1);
  }
}

// Only run when called directly, not when imported
if (import.meta.url === `file://${process.argv[1]}`) {
  createOrUpdateAdmin().then(() => {
    process.exit(0);
  });
}
