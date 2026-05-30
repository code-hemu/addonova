import process from 'node:process';
import {createTask} from './task.js';
import {getDestDir} from './paths.js';
import {createFolder, removeFolder, log, getConfig} from './utils.js';

export function createFolderTask() {
    const folder = async ({platforms, isDebug, logInfo}) => {
        process.env.NODE_ENV = isDebug ? 'development' : 'production';
        for(const platform of platforms){
            const config = await getConfig(platform);
            if (config && Object.keys(config).length != 0){
                await removeFolder(getDestDir({isDebug, platform}));
                logInfo ? log.ok(`Folder Removed: ${getDestDir({isDebug, platform})}`) : null;

                await createFolder(getDestDir({isDebug, platform}));
                logInfo ? log.ok(`Folder Created: ${getDestDir({isDebug, platform})}`) : null;
            }
        }
    };
    return createTask(
        'Environment Create',
        folder,
    );
}
export default createFolderTask();
