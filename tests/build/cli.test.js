import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execFileAsync = promisify(execFile);
const rootDir = resolve(import.meta.dirname, '../..');

test('build CLI prints help', async () => {
  const { stdout } = await execFileAsync('node', [
    resolve(rootDir, 'src/build/cli.js'),
    'build',
    '--help',
  ]);

  assert.match(stdout, /WebExtension build utility/);
  assert.match(stdout, /--chrome\s+Google Chrome/);
  assert.match(stdout, /--firefox\s+Mozilla Firefox/);
  assert.match(stdout, /--watch\s+Watch for changes and reload opened extensions/);
  assert.match(stdout, /--open\s+Open a browser/);
  assert.match(stdout, /--version=1\.2\.3/);
});
