# Templates

## Scaffolding

When you run `addonova init my-extension`, the CLI:

1. Copies the template tree from `templates/extension/`
2. Prompts to select target browsers
3. Renders `{{ variable }}` placeholders in `.tpl` files
4. Copies only the config/platform files for selected browsers
5. Offers to run `npm install`

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{name}}` | Package name (kebab-case) | `my-extension` |
| `{{description}}` | Package description | `My awesome extension` |
| `{{version}}` | Initial version | `0.0.1` |
| `{{browsers}}` | Formatted browser list for comments | `Chrome, Firefox` |
| `{{browsersList}}` | Browser list for npm scripts | `chrome,firefox` |
| `{{year}}` | Current year | `2026` |

## Library Files

Generated projects include a reusable library under `src/js/lib/`:

### `browser.js` — API Abstraction
Provides cross-browser wrappers for:
- `app.storage` — localStorage with `read`, `write`, `update`, `load`
- `app.popup` — Popup messaging (send, receive, port-based)
- `app.window` — Window management (create, get, update, remove, query)
- `app.tab` — Tab management (get, remove, update, open, query)
- `app.on` — Event listeners (management, uninstalled, installed, startup, connect, storage, message)
- `app.interface` — Popup window creation

### `runtime.js` — Lifecycle Management
- Version reporting
- Uninstall URL configuration
- Install/update detection (shows support page on install or after 45 days)
- Message routing between popup and background scripts

### `config.js` — Default Settings
```js
{
  welcome: { lastupdate: Date.now() },
  interface: { size: [425, 575], context: 'popup' }
}
```

### `common.js` — Lifecycle Hooks
```js
// Called on startup
core.start();

// Called on install
core.install();

// Both call:
core.load();
```

## Platform Config Files

Each browser config (`config/{platform}.js`) defines entry points for JS, CSS, HTML, and assets:

### Chrome / Edge / Opera / Naver
Include library files (browser.js, runtime.js, config.js, common.js) and platform.js for store links.

### Firefox / Thunderbird
Simpler setup — no library wrapper included. Firefox uses direct WebExtension APIs.

## Platform Runtime

Each `platform/{browser}/platform.js` exports:
- `API` — Auto-detects `browser` vs `chrome` namespace
- `LINKS` — Store-specific URLs for reviews and support

## Manifest Handling

- Primary manifest: `src/manifest/manifest.json` (MV3)
- Firefox override: `src/manifest/manifest-firefox.json` (uses `background.scripts` instead of `service_worker`, adds `browser_specific_settings.gecko`)
- The manifest bundler selects the platform-specific manifest if it exists, otherwise falls back to the generic one
