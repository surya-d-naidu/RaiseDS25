console.log('Starting admin creation script...');

try {
  const { Pool } = require('pg');
  console.log('✓ pg module loaded');
  
  const bcrypt = require('bcrypt');
  console.log('✓ bcrypt module loaded');
  
  const pool = new Pool({ 
    connectionString: "postgresql://postgres:Lucky_raiseds@25@localhost:5432/raiseds25_db"
  });
  console.log('✓ Pool created');
  
  pool.query('SELECT 1 as test')
    .then(res => {
      console.log('✓ Database connected successfully');
      console.log('Test query result:', res.rows[0]);
      
      // Now create admin user
      return bcrypt.hash('admin123', 10);
    })
    .then(hashedPassword => {
      console.log('✓ Password hashed');
      
      return pool.query(`
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
    })
    .then(result => {
      console.log('✓ Admin user created with ID:', result.rows[0].id);
      console.log('Login credentials:');
      console.log('  Email: admin@raiseds25.com');
      console.log('  Password: admin123');
      return pool.end();
    })
    .catch(err => {
      console.error('Error:', err.message);
      console.error('Full error:', err);
      pool.end();
    });
    
} catch (error) {
  console.error('Script error:', error.message);
}
