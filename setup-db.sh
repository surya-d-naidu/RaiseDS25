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

echo "🗄️  Setting up database tables..."
npx esbuild server/seed.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/seed.js
node dist/seed.js

echo "👤 Setting up admin user..."
npx esbuild server/create-admin.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/create-admin.js
node dist/create-admin.js

echo "🔄 Removing old admin account..."
npx esbuild server/remove-old-admin.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/remove-old-admin.js
node dist/remove-old-admin.js

echo "✅ Database setup completed successfully!"
echo "🎯 Admin user credentials:"
echo "   Username: surya-d-naidu"
echo "   Email: admin@raiseds25.org"
echo "   Password: 7075052734"