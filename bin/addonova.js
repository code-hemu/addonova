#!/usr/bin/env node
import { runCli } from '../src/cli/index.js';

await runCli(process.argv.slice(2));
