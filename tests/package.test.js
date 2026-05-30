import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');

test('package exports the init command', async () => {
  const pkg = await import('../src/index.js');

  assert.equal(typeof pkg.init, 'function');
});

test('package metadata points to the CLI entry file', async () => {
  const packageJson = JSON.parse(
    await readFile(resolve(rootDir, 'package.json'), 'utf8')
  );

  assert.equal(packageJson.bin.addonova, './bin/addonova.js');
  await access(resolve(rootDir, packageJson.bin.addonova));
});

test('package publish list includes the extension templates folder', async () => {
  const packageJson = JSON.parse(
    await readFile(resolve(rootDir, 'package.json'), 'utf8')
  );

  assert.deepEqual(packageJson.files, ['bin/', 'src/', 'templates/']);
});
