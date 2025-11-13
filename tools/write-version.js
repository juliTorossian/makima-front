// tools/write-version.js
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const pkg = require('../package.json');

function safeExec(cmd) {
  try {
    return execSync(cmd).toString().trim();
  } catch {
    return 'unknown';
  }
}

const version = pkg.version;
const commitHash = safeExec('git rev-parse --short HEAD');
const branch = safeExec('git rev-parse --abbrev-ref HEAD');
const buildTime = new Date().toISOString();

const data = {
  version,
  commitHash,
  branch,
  buildTime
};

writeFileSync('src/assets/version.json', JSON.stringify(data, null, 2));
console.log('✅ version.json actualizado:', data);
