import { fork } from 'node:child_process';
import process from 'node:process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runTool() {
  const serverPath = resolve(__dirname, '../tools/tools-server.js');

  if (!existsSync(serverPath)) {
    console.error('[*] Addonova tools server not found. Reinstall the package.');
    process.exit(1);
  }

  const child = fork(serverPath, [], {
    stdio: 'inherit',
  });

  process.on('SIGINT', () => {
    child.kill('SIGKILL');
    process.exit(130);
  });

  await new Promise((resolve, reject) =>
    child.on('error', reject).on('close', (code) => {
      if (code !== 0) process.exit(code);
      resolve();
    })
  );
}
