#!/usr/bin/env node
import process from 'node:process';
import { init } from '../src/commands/init.js';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'init':
    await init(args);
    break;
  case '--help':
  case '-h':
  default:
    console.log(`
  addonova — Cross-browser WebExtension toolkit

  Usage:
    npx addonova init <project-name>   Scaffold a new extension project
    npx addonova --help                 Show this help
    `);
    break;
}
