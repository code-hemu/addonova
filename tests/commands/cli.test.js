import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execFileAsync = promisify(execFile);
const rootDir = resolve(import.meta.dirname, '../..');

test('addonova CLI prints help', async () => {
  const { stdout } = await execFileAsync('node', [
    resolve(rootDir, 'bin/addonova.js'),
    '--help',
  ]);

  assert.match(stdout, /Addonova - browser extension toolkit/);
  assert.match(stdout, /npx addonova init <my-extension>/);
  assert.match(stdout, /npx addonova build \[options\]/);
  assert.match(stdout, /npx addonova zip/);
});
