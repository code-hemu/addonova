import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {fork} from 'node:child_process';
import {log} from './utils.js';

function printHelp() {
    console.log([
        'WebExtension build utility',
        'Usage: npm run build -- [options]',
        '',
        'To narrow down the list of build targets (for efficiency):',
        '  --all          Build for all platforms',
        '  --chrome       Google Chrome (MV3)',
        '  --edge         Microsoft Edge',
        '  --firefox      Mozilla Firefox',
        '  --opera        Opera Browser',
        '  --naver        Naver Whale',
        '  --thunderbird  Mozilla Thunderbird',
        '',
        'Other parameters:',
        '  --release       Build release version (default)',
        '  --debug         Build debug version',
        '  --watch         Watch for changes and rebuild automatically',
        '  --log-info      Log info messages',
        '  --log-warn      Log warning messages',
        '  --test          Build test version (for testing in development environment)',
        '  --version=1.2.3 Append version to output file name (e.g. extension-name-chrome-1.2.3.zip)',
        '  -h, --help      Show this help message',
    ].join('\n'));
}

const __filename = join(dirname(fileURLToPath(import.meta.url)), 'build.js');

async function executeChildProcess(args) {
    const child = fork(__filename, args);
    process.on('SIGINT', () => {
        child.kill('SIGKILL');
        process.exit(130);
    });
    return new Promise((resolve, reject) => child.on('error', reject).on('close', resolve));
}

function validateArguments(args) {
    const validationErrors = [];
    const validFlags = [
        '--all',
        '--chrome',
        '--edge',
        '--naver',
        '--opera',
        '--firefox',
        '--thunderbird',
        '--release',
        '--debug',
        '--watch',
        '--log-info',
        '--log-warn',
        '--test',
        '--version=*',
        '--help',
        '-h'
    ];
    const invalidFlags = args.filter((flag) => !validFlags.includes(flag) && !flag.startsWith('--version='));
    invalidFlags.forEach((flag) => validationErrors.push(`Invalid flag ${flag}`));
    return validationErrors;
}

async function run() {
    const subcommand = process.argv[2];
    let args = process.argv.slice(3);

    if (subcommand === 'zip') {
        args = ['--all', '--release'];
    }

    const shouldPrintHelp = args.length === 0 || (subcommand !== 'build' && subcommand !== 'zip') || args.includes('-h') || args.includes('--help');
    if (shouldPrintHelp) {
      printHelp();
      process.exit(0);
    }
    const validationErrors = validateArguments(args);
    if (validationErrors.length > 0) {
        validationErrors.forEach(log.error);
        log.error('[X] No target platform specified.');
        printHelp();
        process.exit(130);
    }
    await executeChildProcess(args);
}
run();
