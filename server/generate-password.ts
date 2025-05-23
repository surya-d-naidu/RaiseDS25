import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function generatePasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Generate a hash for "7075052734"
async function main() {
  const hash = await generatePasswordHash("7075052734");
  console.log("Generated hash for '7075052734':", hash);
  
  // Verify the hash format
  const [hashedPart, saltPart] = hash.split(".");
  console.log("Hash part length:", hashedPart.length);
  console.log("Salt part length:", saltPart.length);
}

main().catch(console.error);