{
  "name": "{{name}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "json.schemaValidation": "off",
  "license": "GPLv3",
  "author": "{{name}}",
  "type": "module",
  "engines": {
    "node": ">=22",
    "npm": ">=11"
  },
  "scripts": {
    "build": "node --max-old-space-size=3072 workspace/tasks/cli.js build --all --release",
    "release": "node workspace/tasks/cli.js build --all --release",
    "release:chrome": "node --max-old-space-size=3072 workspace/tasks/cli.js build --chrome --release",
    "release:edge": "node --max-old-space-size=3072 workspace/tasks/cli.js build --edge --release",
    "release:opera": "node --max-old-space-size=3072 workspace/tasks/cli.js build --opera --release",
    "release:naver": "node --max-old-space-size=3072 workspace/tasks/cli.js build --naver --release",
    "edge": "node --max-old-space-size=3072 workspace/tasks/cli.js build --edge --release",
    "help": "node --max-old-space-size=3072 workspace/tasks/cli.js --help",
    "debug": "node --max-old-space-size=3072 workspace/tasks/cli.js build --all --debug",
    "debug:chrome": "node --max-old-space-size=3072 workspace/tasks/cli.js build --chrome --debug",
    "watch": "node --max-old-space-size=3072 workspace/tasks/cli.js build --all --debug --watch",
    "zip": "node --max-old-space-size=3072 workspace/tasks/cli.js zip",
    "chrome:watch": "node --max-old-space-size=3072 workspace/tasks/cli.js build --chrome --release --watch",
    "locales": "node --max-old-space-size=3072 workspace/tools/translate.js"
  },
  "devDependencies": {
    "@craftamap/esbuild-plugin-html": "^0.9.0",
    "chokidar": "^5.0.0",
    "esbuild": "^0.27.3",
    "esbuild-sass-plugin": "^3.6.0",
    "globals": "^17.4.0",
    "globby": "^16.1.0",
    "sass": "^1.97.3",
    "yazl": "^3.3.1"
  }
}
