# Manual Database Migration Steps
# Follow these steps to migrate from Neon to local PostgreSQL

## Step 1: Install PostgreSQL tools if not already installed
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib postgresql-client
```

## Step 2: Start PostgreSQL service
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 3: Create local database and user
```bash
# Switch to postgres user and create database
sudo -u postgres createdb raiseds25_db

# Create user and set password
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE raiseds25_db TO postgres;"
```

## Step 4: Export data from Neon
```bash
# Create backup directory
mkdir -p ./db_backup

# Export from Neon (replace with your Neon URL)
pg_dump "postgresql://neondb_owner:npg_xZIcvFJAO29V@ep-autumn-pond-a1b1bzgw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" \
  --verbose \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --file="./db_backup/neon_backup.sql"
```

## Step 5: Import to local PostgreSQL
```bash
# Import to local database
psql "postgresql://postgres:password@localhost:5432/raiseds25_db" -f ./db_backup/neon_backup.sql
```

## Step 6: Update .env file
```bash
# Backup original .env
cp .env .env.backup

# Update DATABASE_URL in .env
# Change from: DATABASE_URL=postgresql://neondb_owner:...
# To: DATABASE_URL=postgresql://postgres:password@localhost:5432/raiseds25_db
```

## Step 7: Test the connection
```bash
# Test with Node.js
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \\'public\\';')
  .then(res => {
    console.log('✅ Connection successful! Tables:', res.rows[0].table_count);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    pool.end();
  });
"
```

## Troubleshooting

### If pg_dump is not found:
```bash
sudo apt install postgresql-client
```

### If PostgreSQL is not running:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### If authentication fails:
```bash
sudo -u postgres psql
\password postgres
# Set password to 'password'
```

### If database exists error:
```bash
sudo -u postgres dropdb raiseds25_db
sudo -u postgres createdb raiseds25_db
```
