import path from 'node:path';
import { build } from 'esbuild';
import {getDestDir} from './paths.js';
import {readFile, writeFile, getConfig, getAllFiles, log, fileExistsInConfig} from './utils.js';
import {createTask} from './task.js';

const srcCSSDir = 'src/css';

async function removeTopSourceComment(filePath) {
    const code = await readFile(filePath, 'utf8');
    const newCode = code.replace(/^\/\*[\s\S]*?\*\//, '');
    await writeFile(filePath, newCode);
}

async function esbuildCSS(config, isDebug, platform) {
    let buildResult, outputs;
    const dir = getDestDir({isDebug, platform});

    for (const [dest, src] of Object.entries(config.entry)) {
        buildResult = await build({
            entryPoints: src,
            outdir: path.join(dir, dest),
            entryNames: config.filename,
            loader: {
                '.css': 'css'
            },
            minify: config.minify,
            sourcemap: config.sourcemap,
            metafile: true,
            write: true
        });

        if (!isDebug) {
            outputs = Object.keys(buildResult.metafile.outputs);
            for (const file of outputs) {
                if (file.endsWith('.css')) {
                    await removeTopSourceComment(file);
                }
            }
        }
    }
}

function createBundleCSSTask(srcCSSDir) {
    let currentWatchFiles;

    const bundleCSS = async ({platforms, isDebug, logInfo, logWarn}) => {
        for (const platform of platforms) {
            const config = await getConfig(platform);
            const cssConfig = config.css;
            if (cssConfig) {
                await esbuildCSS(cssConfig, isDebug, platform);
                if (logInfo) log.ok(`Bundling CSS for ${platform}...`);
            } else {
                if (logWarn) log.warn(`No CSS config found for ${platform}, skipping CSS bundling.`);
            }
        }
    }

    const onChange = async (changedFiles, watcher, platforms, isDebug) => {
        for (const platform of platforms) {
            const config = await getConfig(platform);
            if (config.css) {
                const exists = await fileExistsInConfig(
                    config.css.entry,
                    changedFiles[0]
                );
                if (exists) {
                    const newConfig = {
                        css: {
                            entry: exists,
                            filename: config.css.filename,
                            minify: config.css.minify,
                            sourcemap: config.css.sourcemap
                        }
                    }
                    await esbuildCSS(newConfig.css, isDebug, platform);
                }
            }
        }

        const newWatchFiles = await getAllFiles(srcCSSDir);
        watcher.unwatch(
            currentWatchFiles.filter((oldFile) => !newWatchFiles.includes(oldFile))
        );
        watcher.add(
            newWatchFiles.filter((newFile) => !currentWatchFiles.includes(newFile))
        );
    }

    return createTask(
        'bundle CSS',
        bundleCSS,
    ).addWatcher(
        async () => {
            currentWatchFiles = await getAllFiles(srcCSSDir);
            return currentWatchFiles;
        }, onChange);
}

export default createBundleCSSTask(srcCSSDir);
