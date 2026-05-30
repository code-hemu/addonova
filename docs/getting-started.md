# Getting Started with Addonova

Addonova is a WebExtension framework for scaffolding and building cross-browser browser extensions.

## Prerequisites

- **Node.js** >= 20.19 (framework), >= 22 (generated projects)
- **npm** >= 11 (generated projects)

## Quick Start

Create a new extension and start developing in minutes:

```bash
npx addonova init my-extension
cd my-extension
npm install
npm run dev
```

The `init` command will:
1. Prompt for a project name (or use the one provided)
2. Ask which browsers you want to target
3. Scaffold a complete extension project
4. Offer to run `npm install` automatically

## Development Workflow

### Start Dev Mode

```bash
npm run dev
```

This runs `addonova build --all --debug --watch`, which:
- Builds for all selected browsers in debug mode (no minification, sourcemaps enabled)
- Watches for file changes and auto-rebuilds
- Opens the extension in the browser

### Build Specific Browsers

```bash
# Release build for all browsers
npm run release

# Release build for specific browsers
npm run release:chrome
npm run release:firefox
npm run release:edge

# Debug builds
npm run debug:opera
npm run debug:naver
npm run debug:thunderbird
```

### Create Distribution Archives

```bash
npm run zip
```

This creates `.zip` (Chrome, Edge, Opera, Naver) and `.xpi` (Firefox, Thunderbird) files in `.output/release/`.

## Project Structure

A generated extension follows this structure:

```
my-extension/
├── config/              # Per-browser build configuration
│   ├── chrome.js
│   ├── edge.js
│   ├── firefox.js
│   ├── opera.js
│   ├── naver.js
│   └── thunderbird.js
├── platform/            # Platform-specific runtime files
│   ├── chrome/platform.js
│   ├── edge/platform.js
│   ├── opera/platform.js
│   └── naver/platform.js
├── src/                 # Extension source code
│   ├── _locales/        # Localization files (.i18n format)
│   ├── assets/          # Static assets (icons, etc.)
│   ├── css/             # Stylesheets
│   ├── html/            # HTML pages (popup, options, etc.)
│   ├── js/              # JavaScript source code
│   │   ├── background.js
│   │   ├── popup.js
│   │   └── lib/         # Core library files
│   └── manifest/        # Manifest files (MV3)
├── .output/             # Build output (generated)
│   ├── debug/
│   ├── release/
│   └── profiles/
└── package.json
```

## Next Steps

- [CLI Reference](cli.md) — Full command and options reference
- [Build System](build-system.md) — How the build pipeline works
- [Architecture](architecture.md) — Project architecture overview
- [Templates](templates.md) — Template system and extension structure
- [Internationalization](i18n.md) — Locale and translation system
