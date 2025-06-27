// Check notifications in database
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function checkNotifications() {
  try {
    // Get all notifications
    const notifications = await sql`
      SELECT 
        id, 
        title, 
        content, 
        type, 
        is_active,
        created_at,
        updated_at
      FROM notifications 
      ORDER BY created_at DESC;
    `;
    
    console.log('All notifications in database:');
    console.log('================================');
    
    if (notifications.length === 0) {
      console.log('No notifications found in database');
      return;
    }
    
    notifications.forEach(notification => {
      console.log(`\nNotification ID: ${notification.id}`);
      console.log(`  Title: ${notification.title}`);
      console.log(`  Content: ${notification.content}`);
      console.log(`  Type: ${notification.type}`);
      console.log(`  Active: ${notification.is_active ? '✓' : '✗'}`);
      console.log(`  Created: ${notification.created_at}`);
      console.log(`  Updated: ${notification.updated_at}`);
    });
    
    const activeCount = notifications.filter(n => n.is_active).length;
    console.log(`\nSummary:`);
    console.log(`  Total notifications: ${notifications.length}`);
    console.log(`  Active notifications: ${activeCount}`);
    
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
}

checkNotifications();
