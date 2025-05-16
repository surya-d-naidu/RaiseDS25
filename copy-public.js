// Copy public files to dist directory
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import path from 'path';

// Define paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcePath = path.resolve(__dirname, 'public');
const destPath = path.resolve(__dirname, 'dist/public');

// Verify source directory exists
if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Source directory not found: ${sourcePath}`);
  process.exit(1);
}

// List files to be copied
const files = fs.readdirSync(sourcePath);
console.log(`📁 Found ${files.length} files in public directory:`);
files.forEach(file => console.log(`  - ${file}`));

// Ensure destination directory exists
fs.ensureDirSync(destPath);

// Copy files
try {
  fs.copySync(sourcePath, destPath, { overwrite: true });
  console.log(`✅ Successfully copied public files to ${destPath}`);
  
  // Verify files were copied
  const copiedFiles = fs.readdirSync(destPath);
  console.log(`📁 Verified ${copiedFiles.length} files in destination directory:`);
  copiedFiles.forEach(file => console.log(`  - ${file}`));
} catch (err) {
  console.error('❌ Error copying public files:', err);
  process.exit(1);
}
