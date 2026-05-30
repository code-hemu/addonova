import { fork } from 'node:child_process';
import process from 'node:process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

import { init } from '../commands/init.js';
import { printHelp } from './help.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runBuildCommand(command, args) {
  const cliPath = resolve(__dirname, '../build/cli.js');

  if (!existsSync(cliPath)) {
    console.error('[*] Addonova build CLI not found. Reinstall the package.');
    process.exit(1);
  }

  const child = fork(cliPath, [command, ...args], {
    execArgv: ['--max-old-space-size=3072'],
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

export async function runCli(argv) {
  const [command, ...args] = argv;

  switch (command) {
    case 'init':
      await init(args);
      break;
    case 'build':
    case 'zip':
      await runBuildCommand(command, args);
      break;
    case '--help':
    case '-h':
    default:
      printHelp();
      break;
  }
}
