# Addonova

[![Addonova Social Banner](https://raw.githubusercontent.com/code-hemu/addonova/refs/heads/main/docs/assets/capture.jpg)](https://github.com/code-hemu/addonova)

WebExtension framework for scaffolding and building cross-browser browser extensions.

## Quick Start

```bash
npx addonova init my-extension
cd my-extension
npm run release
```

## Supported Browsers

- Chrome (MV3)
- Firefox
- Microsoft Edge
- Opera
- Naver Whale
- Thunderbird

## CLI Commands

| Command | Description |
| --- | --- |
| `addonova init <name>` | Scaffold a new extension project |
| `addonova build [options]` | Build the current extension project |
| `addonova zip` | Create release zip bundles |
| `addonova tool` | Open the i18n tools UI in a browser |
| `addonova --help` | Show help |

## Build Scripts

Generated projects include these npm scripts:

```bash
npm run release
npm run release:chrome
npm run release:edge
npm run release:opera
npm run release:firefox
npm run release:thunderbird
npm run release:naver

npm run debug
npm run debug:chrome
npm run debug:edge
npm run debug:opera
npm run debug:firefox
npm run debug:thunderbird
npm run debug:naver

npm run dev
npm run zip
npm test
```

You can also call the CLI directly:

```bash
npx addonova build --all --release
npx addonova build --chrome --debug
npx addonova build --all --debug --watch
npx addonova zip
npx addonova tool
```

## Build Options

| Option | Description |
| --- | --- |
| `--all` | Build all configured browsers |
| `--chrome` | Build Chrome target |
| `--edge` | Build Microsoft Edge target |
| `--firefox` | Build Firefox target |
| `--opera` | Build Opera target |
| `--naver` | Build Naver Whale target |
| `--thunderbird` | Build Thunderbird target |
| `--release` | Create release build |
| `--debug` | Create debug build |
| `--watch` | Rebuild when files change and reload opened extensions |
| `--open` | Open a browser with the debug extension loaded |
| `--test` | Build test version |
| `--version=x.x.x` | Append version to output zip names |

## Dev Mode

```bash
npm run dev
```

Dev mode runs:

```bash
addonova build --all --debug --watch
```

Addonova opens an isolated browser profile, loads the unpacked debug extension from `.output/debug/<browser>`, watches source files, rebuilds changed assets, and reloads the extension when the built files change.

## Generated Extension Structure

```txt
my-extension/
|-- config/
|-- platform/
|-- src/
|   |-- _locales/
|   |-- assets/
|   |-- css/
|   |-- html/
|   |-- js/
|   `-- manifest/
|-- .output/
`-- package.json
```

## Locales / i18n

Locale files use the `.i18n` format:

```txt
@extensionName
My Extension

@extensionDescription
This is my extension description.
```

Run the interactive message manager from a generated project:

```bash
node node_modules/addonova/src/tools/translate.js
```

Or use the browser-based i18n tools UI:

```bash
npx addonova tool
```

This opens a full UI at `http://localhost:9876` with:
- **Translate tab** — view all locale messages, add new messages with auto-translation, delete messages
- **JSON → i18n tab** — drag-and-drop a `messages.json` file to convert to `.i18n` format

## Development

Run the test suite:

```bash
npm test
```

Check what will be published:

```bash
npm pack --dry-run
```

## Requirements

- Addonova package: Node.js >= 20.19
- Generated extension template: Node.js >= 22 and npm >= 11
