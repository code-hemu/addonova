export function printHelp() {
  console.log(`
  Addonova - browser extension toolkit

  Usage:
    npx addonova init <my-extension>   Scaffold a new extension project
    npx addonova build [options]       Build the extension
    npx addonova zip                   Create release zip bundles
    npx addonova --help                Show this help

  Build options:
    --all, --chrome, --firefox, --edge, --opera, --naver, --thunderbird
    --release, --debug, --watch, --test, --version=x.x.x
  `);
}
