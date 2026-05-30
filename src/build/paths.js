import {dirname, join} from 'node:path';

let rootDir = process.cwd();

export const absolutePath = (path) => {
    return join(rootDir, path);
};
export function setRootDir(dir) {
    rootDir = dir;
}
export function getDestDir({isDebug, platform}) {
    const buildTypeDir = `.output/${isDebug ? 'debug':'release'}`;
    return `${buildTypeDir}/${platform}`;
}
export default {
    getDestDir,
    rootDir,
    absolutePath,
    setRootDir,
};
