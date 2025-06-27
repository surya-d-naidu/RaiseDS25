#!/bin/bash

# Migrate from Neon cloud database to local PostgreSQL
# This script will export data from Neon and import it to local PostgreSQL

set -e

echo "🚀 Starting database migration from Neon to local PostgreSQL..."

# Configuration
NEON_DATABASE_URL="postgresql://neondb_owner:npg_xZIcvFJAO29V@ep-autumn-pond-a1b1bzgw-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
LOCAL_DATABASE_NAME="raiseds25_db"
LOCAL_DATABASE_USER="postgres"
LOCAL_DATABASE_PASSWORD="Lucky_raiseds@25"
LOCAL_DATABASE_URL="postgresql://${LOCAL_DATABASE_USER}:${LOCAL_DATABASE_PASSWORD}@localhost:5432/${LOCAL_DATABASE_NAME}"

# Backup directory
BACKUP_DIR="./db_backup"
BACKUP_FILE="${BACKUP_DIR}/neon_backup.sql"

echo "📁 Creating backup directory..."
mkdir -p "$BACKUP_DIR"

echo "🔍 Checking if local PostgreSQL is running..."
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo "Please start PostgreSQL service first:"
    echo "  sudo systemctl start postgresql"
    echo "  OR"
    echo "  sudo service postgresql start"
    exit 1
fi

echo "✅ PostgreSQL is running"

echo "🗄️ Creating local database..."
# Drop database if exists and create new one
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${LOCAL_DATABASE_NAME};" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE ${LOCAL_DATABASE_NAME};"

echo "👤 Setting up database user..."
# Create user if not exists and grant permissions
sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '${LOCAL_DATABASE_USER}') THEN CREATE USER ${LOCAL_DATABASE_USER} WITH PASSWORD '${LOCAL_DATABASE_PASSWORD}'; END IF; END \$\$;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${LOCAL_DATABASE_NAME} TO ${LOCAL_DATABASE_USER};"

echo "📤 Exporting data from Neon database..."
# Export schema and data from Neon
pg_dump "$NEON_DATABASE_URL" \
    --verbose \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --file="$BACKUP_FILE"

echo "📥 Importing data to local PostgreSQL..."
# Import to local database
psql "$LOCAL_DATABASE_URL" -f "$BACKUP_FILE"

echo "🔧 Updating .env file..."
# Backup original .env
cp .env .env.backup

# Update DATABASE_URL in .env file
sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${LOCAL_DATABASE_URL}|" .env

echo "✅ Migration completed successfully!"
echo ""
echo "📋 Summary:"
echo "  • Neon data exported to: $BACKUP_FILE"
echo "  • Local database: $LOCAL_DATABASE_NAME"
echo "  • Database URL updated in .env"
echo "  • Original .env backed up to .env.backup"
echo ""
echo "🧪 Testing local database connection..."
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \\'public\\';')
  .then(res => {
    console.log('✅ Local database connection successful!');
    console.log('📊 Tables found:', res.rows[0].table_count);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    pool.end();
    process.exit(1);
  });
"

echo ""
echo "🎉 Migration complete! Your project is now using local PostgreSQL."
echo "💡 To revert back to Neon, restore .env.backup to .env"
