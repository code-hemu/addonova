# Build System

Addonova uses a modular, task-based build pipeline powered by **esbuild** for JavaScript and CSS bundling.

## Pipeline

Tasks execute sequentially in this order:

### 1. Create Folder
Cleans and creates the output directory structure under `.output/{debug|release}/{platform}/`.

### 2. Bundle HTML
- Reads HTML entry points from the per-browser config
- **Debug mode:** copies HTML as-is
- **Release mode:** minifies with `html-minifier-terser`
- **Validation:** `HTMLHint` lints all HTML (fails build on errors)

### 3. Bundle CSS
- Uses **esbuild** with the CSS loader
- **Debug mode:** no minification, sourcemaps enabled
- **Release mode:** minified, comments stripped

### 4. Bundle JavaScript
- Uses **esbuild** with automatic detection of module format
- Entry points and output structure defined in per-browser config
- **Debug mode:** no minification, no drops, sourcemaps enabled
- **Release mode:** minified, `console`/`debugger` statements dropped
- Library files (platform API wrappers, config, runtime) are included automatically for Chrome-based browsers

### 5. Bundle Locales
- Reads `.i18n` files from `src/_locales/`
- Converts to Chrome-compatible `_locales/{locale}/messages.json`
- Multiple `.i18n` files for the same locale are merged

### 6. Bundle Manifest
- Reads `src/manifest/manifest-{platform}.json` (falls back to `manifest.json`)
- Injects build-specific values (version, description, platform info)
- **Debug builds:** version set to `"1"`
- **Release builds:** version read from `package.json` or `--version=` flag
- Naver Whale: `default_locale` forced to `'ko'`

### 7. Copy Assets
Copies static files from source directories (icons, fonts, etc.)

### 8. Zip (Release Only)
Creates distributable archives:
- `.zip` for Chrome, Edge, Opera, Naver Whale
- `.xpi` for Firefox, Thunderbird
- Uses git commit timestamps for reproducible archives

## Watch Mode

With `--watch`, all tasks register chokidar file watchers with 200ms debounce. On file changes:
- Modified files trigger re-bundling of the affected task
- New files trigger watcher re-initialization
- Browser extension is auto-reloaded via `web-ext`

## Browser Runner

The `--open` flag launches the extension in the target browser using `web-ext`:
- Creates isolated profiles in `.output/profiles/{platform}`
- Supports Chrome, Edge, Firefox, Opera, and Naver Whale
- Automatically resolves browser binaries for each platform (Windows/macOS/Linux)
- Handles graceful cleanup on SIGINT

## Per-Browser Configuration

Each browser's config file (`config/{platform}.js`) exports:

```js
export default {
  js: {
    entry: { 'output/path': ['src/js/file.js', ...] },
    filename: '[name]',
    minify: true,
    sourcemap: false
  },
  css: {
    entry: { 'output/path': ['src/css/file.css', ...] }
  },
  html: {
    entry: { 'output/path': ['src/html/file.html', ...] }
  },
  assets: {
    entry: { 'output/path': 'src/source/path' }
  }
}
```

## Output Structure

```
.output/
├── debug/
│   ├── chrome/       # Unpacked debug build
│   ├── edge/
│   ├── firefox/
│   ├── opera/
│   ├── naver/
│   └── thunderbird/
├── release/
│   └── {platform}/   # Final unpacked release
├── profiles/
│   └── {platform}/   # web-ext browser profiles
└── release/
    ├── {name}-chrome{v}.zip
    ├── {name}-edge{v}.zip
    ├── {name}-firefox{v}.xpi
    ├── {name}-opera{v}.zip
    ├── {name}-naver{v}.zip
    └── {name}-thunderbird{v}.xpi
```
