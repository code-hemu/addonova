import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { selectBrowsers, askQuestion } from '../utils/prompts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '../../template');

const VARIABLE_RE = /\{\{\s*(\w+)\s*\}\}/g;

function render(template, vars) {
  return template.replace(VARIABLE_RE, (_, key) => vars[key] ?? `{{${key}}}`);
}

async function copyDir(src, dest, vars) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name.replace(/\.tpl$/, ''));

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, vars);
    } else if (entry.name.endsWith('.tpl')) {
      const content = await fs.readFile(srcPath, 'utf-8');
      await fs.writeFile(destPath, render(content, vars), 'utf-8');
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function installDependencies(projectDir) {
  console.log('\n⚡ Installing dependencies...');
  const { execSync } = await import('node:child_process');
  execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
}

async function detectPackageManager() {
  const hasLock = f => existsSync(path.join(process.cwd(), f));

  if (hasLock('pnpm-lock.yaml')) return 'pnpm';
  if (hasLock('yarn.lock')) return 'yarn';
  if (hasLock('package-lock.json') || hasLock('bun.lock')) return 'npm';
  return 'npm';
}

export async function init(args) {
  let projectName = args[0];

  if (!projectName) {
    projectName = await askQuestion('Project name: ');
  }

  if (!projectName) {
    console.error('❌ Project name is required.');
    process.exit(1);
  }

  const projectDir = path.resolve(process.cwd(), projectName);

  if (existsSync(projectDir)) {
    console.error(`❌ Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  const browsers = await selectBrowsers();
  const selected = browsers.length > 0 ? browsers : ['chrome', 'firefox'];

  const vars = {
    name: projectName,
    description: 'A cross-browser WebExtension',
    version: '1.0.0',
    browsers: JSON.stringify(selected),
    browsersList: selected.join(', '),
    year: new Date().getFullYear().toString(),
  };

  console.log(`\n📁 Scaffolding "${projectName}" for: ${selected.join(', ')}`);
  await copyDir(TEMPLATE_DIR, projectDir, vars);

  console.log('✔ Template files created.');

  const pm = detectPackageManager();
  const shouldInstall = await askQuestion('\nRun npm install now? (Y/n): ');
  if (shouldInstall.toLowerCase() !== 'n') {
    await installDependencies(projectDir);
  }

  console.log(`
┌──────────────────────────────────────────────┐
│  ✅  "${projectName}" is ready!                │
│                                              │
│  ${projectDir}               │
│                                              │
│  Next steps:                                 │
│    cd ${projectName}                          │
│    npm run build -- --all                     │
│    npm run build -- --chrome --debug          │
│    npm run build -- --firefox --watch         │
│                                              │
│  Targets: ${selected.join(', ').padEnd(30)}│
└──────────────────────────────────────────────┘
`);
}
