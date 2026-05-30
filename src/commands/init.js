import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { selectBrowsers, askQuestion } from '../utils/prompts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '../../templates/extension');

const VARIABLE_RE = /\{\{\s*(\w+)\s*\}\}/g;

function render(template, vars) {
  return template.replace(VARIABLE_RE, (_, key) => vars[key] ?? `{{${key}}}`);
}

async function copyDir(src, dest, vars, selected = []) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  const dirName = path.basename(src);

  for (const entry of entries) {
    const entryName = path.basename(entry.name, path.extname(entry.name));

    if ((dirName === 'config' || dirName === 'platform') && selected.length > 0 && !selected.includes(entryName)) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name.replace(/\.tpl$/, ''));

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, vars, selected);
    } else if (entry.name.endsWith('.tpl')) {
      const content = await fs.readFile(srcPath, 'utf-8');
      await fs.writeFile(destPath, render(content, vars), 'utf-8');
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function installDependencies(projectDir) {
  console.log('\n[+] Installing dependencies...');
  const { execSync } = await import('node:child_process');
  execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
}

export async function init(args) {
  let projectName = args[0];

  if (!projectName) {
    projectName = await askQuestion('Project name: ');
  }

  if (!projectName) {
    console.error('[*] Project name is required.');
    process.exit(1);
  }

  const projectDir = path.resolve(process.cwd(), projectName);

  if (existsSync(projectDir)) {
    console.error(`[*] Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  const browsers = await selectBrowsers();
  const selected = browsers.length > 0 ? browsers : ['chrome', 'firefox'];

  const vars = {
    name: projectName,
    description: 'A Browser Extension',
    version: '1.0.0',
    browsers: JSON.stringify(selected),
    browsersList: selected.join(', '),
    year: new Date().getFullYear().toString(),
  };

  console.log(`\n[+] Scaffolding "${projectName}" for: ${selected.join(', ')}`);
  await copyDir(TEMPLATE_DIR, projectDir, vars, selected);

  console.log('[+] Template files created.');

  const shouldInstall = await askQuestion('\nRun npm install now? (Y/n): ');
  if (shouldInstall.toLowerCase() !== 'n') {
    await installDependencies(projectDir);
  }


  console.log(`
  [+] "${projectName}" is ready! 

  📁 ${projectDir}

  Next steps:
    cd ${projectName}
    npm install
    npm run watch

  Targets: ${selected.join(', ').padEnd(30)}

  `);
}
