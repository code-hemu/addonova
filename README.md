# addonova

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

npm run watch
npm run zip
npm test
```

You can also call the CLI directly:

```bash
npx addonova build --all --release
npx addonova build --chrome --debug
npx addonova build --all --debug --watch
npx addonova zip
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
| `--watch` | Rebuild when files change |
| `--test` | Build test version |
| `--version=x.x.x` | Append version to output zip names |

## Package Structure

```txt
addonova/
|-- bin/
|   `-- addonova.js
|-- src/
|   |-- build/
|   |-- cli/
|   |-- commands/
|   |-- tools/
|   |-- utils/
|   `-- index.js
|-- templates/
|   `-- extension/
|-- docs/
|   `-- assets/
|-- tests/
|   |-- build/
|   |-- commands/
|   |-- fixtures/
|   `-- package.test.js
|-- package.json
`-- README.md
```

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
