# Architecture

## Overview

Addonova is structured as a CLI tool that scaffolds extension projects and provides a build system for cross-browser development.

```
bin/addonova.js          # CLI entry point
src/
├── cli/                 # CLI dispatcher & help
│   ├── index.js         # Command routing
│   └── help.js          # Help text
├── commands/
│   └── init.js          # Project scaffolding
├── build/               # Build system
│   ├── build.js         # Build orchestrator
│   ├── cli.js           # Build CLI argument parser
│   ├── browser.js       # web-ext browser launcher
│   ├── bundle-js.js     # JS bundler (esbuild)
│   ├── bundle-css.js    # CSS bundler (esbuild)
│   ├── bundle-html.js   # HTML bundler + minifier + linter
│   ├── bundle-locales.js # .i18n → messages.json
│   ├── bundle-manifest.js # Manifest generation
│   ├── copy.js          # Asset copier
│   ├── folder.js        # Output directory management
│   ├── paths.js         # Path utilities
│   ├── task.js          # Task runner framework
│   ├── utils.js         # General utilities
│   ├── watch.js         # File watcher (chokidar)
│   └── zip.js           # Archive creator (yazl)
├── tools/
│   ├── json2i18n.js     # messages.json → .i18n converter
│   └── translate.js     # Interactive translation tool
└── utils/
    └── prompts.js       # CLI prompt helpers
```

## Key Design Decisions

### Task-Based Pipeline
The build system uses a `Task` abstraction (`src/build/task.js`) where each build step implements `run()` and optional `watch()` methods. Tasks are executed sequentially by `runTasks()`, which also handles timing and error reporting.

### esbuild for Bundling
JS and CSS bundling both rely on esbuild, chosen for its speed and zero-config approach. No webpack, rollup, or bundler config files are needed — all configuration lives in per-browser JavaScript modules.

### No Config Files
The project intentionally avoids configuration files (tsconfig, webpack config, etc.). Browser-specific build settings are expressed as JavaScript exports in `config/{platform}.js`.

### Simple Template Engine
Project scaffolding uses a minimal `{{ variable }}` replacement system rather than a full template engine like Handlebars or EJS. Variables supported: `name`, `description`, `version`, `browsers`, `browsersList`, `year`.

### Cross-Platform Binary Resolution
The browser runner resolves platform-specific binary paths (Chrome, Edge, Opera, Naver Whale) for Windows, macOS, and Linux automatically.

## Data Flow

```
User runs: addonova build --chrome --release
                  │
                  ▼
         src/cli/index.js
         (detects "build" command)
                  │
                  ▼
         src/build/cli.js
         (parses args, forks child)
                  │
                  ▼
         src/build/build.js
         (reads config/, runs tasks)
                  │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
   createFolder  bundleJS  bundleCSS ...
       │
       ▼
   .output/release/chrome/
```
