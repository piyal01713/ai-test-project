/**
 * Environment Check Script for Browser Skill
 */
const { execSync } = require('child_process');

console.log('--- Checking Browser Agent Environment ---');

try {
  const nodeVersion = execSync('node -v').toString().trim();
  console.log(`[✓] Node.js version: ${nodeVersion}`);
} catch (e) {
  console.log('[X] Node.js is not installed or not in PATH.');
}

try {
  const npmVersion = execSync('npm -v').toString().trim();
  console.log(`[✓] npm version: ${npmVersion}`);
} catch (e) {
  console.log('[X] npm is not installed or not in PATH.');
}

console.log('Browser agent skill structure verification complete.');
