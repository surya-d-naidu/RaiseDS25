// Simple script to query users from database
const { execSync } = require('child_process');

try {
  // Generate and run a TypeScript script that will query the database
  const scriptContent = `
  import { db } from "./server/db";
  import { users } from "./shared/schema";

  async function queryUsers() {
    try {
      console.log("Querying database for users...");
      const allUsers = await db.select().from(users);
      console.log(\`Total users: \${allUsers.length}\`);
      
      allUsers.forEach(user => {
        const { password, ...safeUser } = user;
        console.log(safeUser);
      });
      
    } catch (error) {
      console.error("Database error:", error);
    }
  }

  queryUsers().catch(console.error);
  `;
  
  // Write the script to a temporary file
  require('fs').writeFileSync('temp-query.ts', scriptContent);
  
  // Compile and run
  const output = execSync('npx tsx temp-query.ts', { encoding: 'utf8' });
  console.log(output);
  
  // Clean up
  require('fs').unlinkSync('temp-query.ts');
} catch (error) {
  console.error('Error:', error.message);
}
