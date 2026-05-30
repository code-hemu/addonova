import path from 'node:path';
import { minify } from 'html-minifier-terser';
import htmlhint from 'htmlhint';

import { getDestDir } from './paths.js';
import { readFile, writeFile, getConfig, getAllFiles, log, fileExistsInConfig } from './utils.js';
import { createTask } from './task.js';

const srcHTMLDir = 'src/html';
const { HTMLHint } = htmlhint;

const htmlHintRules = {
  'attr-lowercase': true,
  'attr-no-duplication': true,
  'doctype-first': false,
  'id-unique': true,
  'tag-pair': true,
  'tagname-lowercase': true,
};

const htmlMinifyOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeEmptyAttributes: false,
};

function getDestinationFile(destDir, dest, src, filename) {
  const sourceName = path.basename(src, path.extname(src));
  const outputName = `${filename.replace('[name]', sourceName)}.html`;
  return path.join(destDir, dest, outputName);
}

function formatHtmlIssue(file, issue) {
  return `${file}:${issue.line}:${issue.col} ${issue.type.toUpperCase()} ${issue.message}`;
}

function validateHTML(file, html) {
  const issues = HTMLHint.verify(html, htmlHintRules);
  const errors = issues.filter((issue) => issue.type === 'error');

  if (errors.length > 0) {
    throw new Error(errors.map((issue) => formatHtmlIssue(file, issue)).join('\n'));
  }

  for (const issue of issues) {
    log.warn(`[HTML] ${formatHtmlIssue(file, issue)}`);
  }
}

async function bundleHTML(config, isDebug, platform) {
  const dir = getDestDir({ isDebug, platform });

  for (const [dest, sources] of Object.entries(config.entry)) {
    for (const src of sources) {
      const html = await readFile(src, 'utf8');
      validateHTML(src, html);

      const output = isDebug
        ? html
        : await minify(html, htmlMinifyOptions);

      await writeFile(
        getDestinationFile(dir, dest, src, config.filename),
        output,
        'utf8'
      );
    }
  }
}

export function createBundleHTMLTask(srcHTMLDir) {
  const runBundleHTML = async ({ platforms, isDebug, logInfo, logWarn }) => {
    for (const platform of platforms) {
      const config = await getConfig(platform);
      if (config.html) {
        await bundleHTML(config.html, isDebug, platform);
        if (logInfo) log.ok(`Bundling HTML for ${platform}...`);
      } else if (logWarn) {
        log.warn(`No HTML config found for ${platform}, skipping HTML bundling.`);
      }
    }
  };

  const onChange = async (changedFiles, watcher, platforms, isDebug) => {
    for (const platform of platforms) {
      const config = await getConfig(platform);

      if (!config.html) continue;
      const exists = await fileExistsInConfig(
        config.html.entry,
        changedFiles[0]
      );

      if (exists) {
        const newConfig = {
          html: {
            entry: exists,
            filename: config.html.filename,
          },
        };
        await bundleHTML(newConfig.html, isDebug, platform);
      }
    }
  };

  return createTask(
    'bundle HTML',
    runBundleHTML
  ).addWatcher(
    () => getAllFiles(srcHTMLDir),
    onChange
  );
}

export default createBundleHTMLTask(srcHTMLDir);
