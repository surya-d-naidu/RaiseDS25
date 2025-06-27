const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  const pool = new Pool({ 
    connectionString: "postgresql://postgres:Lucky_raiseds@25@localhost:5432/raiseds25_db"
  });
  
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@raiseds25.com']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const result = await pool.query(`
      INSERT INTO users (username, password, email, first_name, last_name, institution, role, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      'admin',
      hashedPassword,
      'admin@raiseds25.com',
      'Admin',
      'User',
      'RAISE DS 2025',
      'admin',
      true
    ]);
    
    console.log('✓ Admin user created successfully!');
    console.log('  Email: admin@raiseds25.com');
    console.log('  Password: admin123');
    console.log('  User ID:', result.rows[0].id);
    
    // Create admin profile
    await pool.query(`
      INSERT INTO profiles (user_id, bio, position, is_committee_member)
      VALUES ($1, $2, $3, $4)
    `, [
      result.rows[0].id,
      'Conference Administrator',
      'System Administrator',
      true
    ]);
    
    console.log('✓ Admin profile created successfully!');
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();
