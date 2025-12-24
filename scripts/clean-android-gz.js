/**
 * Clean .gz files from Android build directories
 * This script removes compressed files that shouldn't be included in the Android APK
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANDROID_PATHS = [
  'android/public',
  'android/app/src/main/assets'
];

/**
 * Recursively find and delete all .gz files in a directory
 */
function deleteGzFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⏭️  Skipping ${dir} (does not exist)`);
    return 0;
  }

  let deletedCount = 0;

  function traverse(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.gz')) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`🗑️  Deleted: ${fullPath}`);
          deletedCount++;
        } catch (error) {
          console.error(`❌ Failed to delete ${fullPath}:`, error.message);
        }
      }
    }
  }

  traverse(dir);
  return deletedCount;
}

/**
 * Main execution
 */
function main() {
  console.log('🧹 Cleaning .gz files from Android directories...\n');

  let totalDeleted = 0;

  for (const dirPath of ANDROID_PATHS) {
    console.log(`📂 Checking ${dirPath}...`);
    const count = deleteGzFiles(dirPath);
    totalDeleted += count;

    if (count > 0) {
      console.log(`✅ Deleted ${count} .gz file(s) from ${dirPath}\n`);
    } else {
      console.log(`✨ No .gz files found in ${dirPath}\n`);
    }
  }

  if (totalDeleted > 0) {
    console.log(`\n🎉 Total: ${totalDeleted} .gz file(s) deleted`);
  } else {
    console.log('\n✨ All clean! No .gz files found.');
  }
}

main();
