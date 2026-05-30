import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, cp, readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);
const rootDir = resolve(import.meta.dirname, '..');
const fixtureDir = resolve(import.meta.dirname, 'fixtures/test-extension');

test('build produces output directory', async () => {
  const tmpDir = await mkdtemp(resolve(tmpdir(), 'addonova-test-'));
  await cp(fixtureDir, tmpDir, { recursive: true });

  await execFileAsync('node', [
    resolve(rootDir, 'src/build/cli.js'),
    'build', '--chrome', '--debug',
  ], { cwd: tmpDir });

  const outputDir = resolve(tmpDir, '.output/debug/chrome');
  await access(outputDir);

  const html = await readFile(resolve(outputDir, 'ui/popup.html'), 'utf8');
  assert.match(html, /Simple/);
});

test('build --release creates release output', async () => {
  const tmpDir = await mkdtemp(resolve(tmpdir(), 'addonova-test-'));
  await cp(fixtureDir, tmpDir, { recursive: true });

  await execFileAsync('node', [
    resolve(rootDir, 'src/build/cli.js'),
    'build', '--chrome', '--release',
  ], { cwd: tmpDir });

  await access(resolve(tmpDir, '.output/release/chrome'));
});
