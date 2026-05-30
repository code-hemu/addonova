import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { createRequire } from 'node:module';

import { getDestDir } from './paths.js';
import { log } from './utils.js';

const WEB_EXT_TARGETS = new Set(['chrome', 'edge', 'firefox', 'opera', 'naver']);
const require = createRequire(import.meta.url);

const chromiumBinaries = {
  edge: {
    win32: [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ],
    darwin: ['/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
    linux: ['microsoft-edge', 'microsoft-edge-stable'],
  },
  opera: {
    win32: [
      'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Opera\\opera.exe',
      'C:\\Program Files\\Opera\\opera.exe',
    ],
    darwin: ['/Applications/Opera.app/Contents/MacOS/Opera'],
    linux: ['opera'],
  },
  naver: {
    win32: [
      'C:\\Program Files\\Naver\\Naver Whale\\Application\\whale.exe',
      'C:\\Program Files (x86)\\Naver\\Naver Whale\\Application\\whale.exe',
    ],
    darwin: ['/Applications/Whale.app/Contents/MacOS/Whale'],
    linux: ['whale'],
  },
};

function expandEnv(value) {
  return value.replace(/%([^%]+)%/g, (_, name) => process.env[name] ?? '');
}

function resolveBinary(platform) {
  const candidates = chromiumBinaries[platform]?.[process.platform] ?? [];

  for (const candidate of candidates) {
    const binary = expandEnv(candidate);
    if (process.platform === 'linux' || existsSync(binary)) {
      return binary;
    }
  }

  return null;
}

function getWebExtBin() {
  try {
    const webExtIndex = require.resolve('web-ext');
    return join(dirname(webExtIndex), 'bin', 'web-ext.js');
  } catch {
    return null;
  }
}

function createWebExtArgs(platform, settings) {
  const sourceDir = resolve(getDestDir({ isDebug: settings.isDebug, platform }));
  const profileDir = resolve(join('.output', 'profiles', platform));
  const args = [
    'run',
    '--source-dir',
    sourceDir,
    '--no-input',
    '--start-url',
    'about:blank',
  ];

  if (platform === 'firefox') {
    args.push('--target', 'firefox-desktop', '--firefox-profile', profileDir);
    return { args, sourceDir, profileDir };
  }

  args.push('--target', 'chromium', '--chromium-profile', profileDir, '--profile-create-if-missing');

  if (platform !== 'chrome') {
    const binary = resolveBinary(platform);
    if (binary) {
      args.push('--chromium-binary', binary);
    } else {
      log.warn(`[!] ${platform} binary not found. Trying the default Chromium browser.`);
    }
  }

  return { args, sourceDir, profileDir };
}

export async function startBrowserRunners(settings) {
  const webExtBin = getWebExtBin();
  const platforms = settings.platforms.filter((platform) => WEB_EXT_TARGETS.has(platform));

  if (!webExtBin || !existsSync(webExtBin)) {
    log.warn('[!] Browser dev runner not found. Run npm install before dev mode.');
    return;
  }

  if (platforms.length === 0) {
    log.warn('[!] Browser dev mode supports Chrome, Edge, Firefox, Opera, and Naver Whale.');
    return;
  }

  settings.browserRunners = [];

  for (const platform of platforms) {
    const { args, sourceDir, profileDir } = createWebExtArgs(platform, settings);

    if (!existsSync(sourceDir)) {
      log.warn(`[!] Extension output missing for ${platform}: ${sourceDir}`);
      continue;
    }

    await mkdir(profileDir, { recursive: true });

    const child = spawn(process.execPath, [webExtBin, ...args], {
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code !== null && code !== 0) {
        log.warn(`[!] Browser runner for ${platform} exited with code ${code}`);
      }
    });

    settings.browserRunners.push(child);
    log.ok(`[+] Started browser runner for ${platform}`);
  }
}

export function stopBrowserRunners(settings) {
  for (const child of settings.browserRunners ?? []) {
    if (!child.killed) child.kill('SIGTERM');
  }
}
