#!/bin/bash

# Database setup script for RAISEDS25 project
# This script initializes the database tables and creates default admin user

set -e  # Exit on any error

echo "🚀 Starting database setup..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies if needed..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🏗️  Building TypeScript files..."
npm run build

echo "🗄️  Setting up database tables and admin user..."
npx esbuild server/seed.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/seed.js
node dist/seed.js

echo "✅ Database setup completed successfully!"
echo "🎯 Default admin user:"
echo "   Email: admin@raiseds25.org"
echo "   Password: admin123"
echo ""
echo "⚠️  Please change the admin password after first login!"