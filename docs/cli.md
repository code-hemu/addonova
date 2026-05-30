# CLI Reference

## Global Command

### `addonova init <name>`

Scaffolds a new extension project.

```bash
npx addonova init my-extension
```

If no name is provided, you will be prompted for one. The command will interactively ask which browsers to target.

### `addonova build [options]`

Builds the extension for one or more browser targets.

### `addonova zip`

Creates release distribution archives (`.zip`/`.xpi`) for all browsers.

Equivalent to `addonova build --all --release`.

### `addonova --help`

Displays the top-level help text.

---

## Build Options

### Target Selection

| Flag | Description |
|------|-------------|
| `--all` | Build for all configured platforms |
| `--chrome` | Google Chrome (Manifest V3) |
| `--edge` | Microsoft Edge |
| `--firefox` | Mozilla Firefox |
| `--opera` | Opera Browser |
| `--naver` | Naver Whale |
| `--thunderbird` | Mozilla Thunderbird |

### Build Modes

| Flag | Description |
|------|-------------|
| `--release` | Build release version (minified, no debug code). Default mode. |
| `--debug` | Build debug version (no minification, sourcemaps included) |
| `--test` | Build test version for development environment testing |

### Development Options

| Flag | Description |
|------|-------------|
| `--watch` | Watch source files for changes and auto-rebuild |
| `--open` | Open a browser with the debug extension loaded |
| `--version=x.x.x` | Append a specific version to output filenames |

### Logging

| Flag | Description |
|------|-------------|
| `--log-info` | Log info-level messages |
| `--log-warn` | Log warning-level messages |
| `-h, --help` | Show build-specific help |

---

## Generated Project Scripts

When you scaffold a project with `init`, the following npm scripts are available:

```bash
npm run dev          # Build all browsers, debug mode, watch, open browser

npm run release          # Release build for all browsers
npm run release:chrome
npm run release:firefox
npm run release:edge
npm run release:opera
npm run release:naver
npm run release:thunderbird

npm run debug            # Debug build for all browsers
npm run debug:chrome
npm run debug:firefox
npm run debug:edge
npm run debug:opera
npm run debug:naver
npm run debug:thunderbird

npm run zip              # Create release archives for all browsers
npm run test             # Run tests
```

All scripts run `addonova build` with the appropriate flags.
