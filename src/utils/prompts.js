import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function askQuestion(query) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(query);
  rl.close();
  return answer.trim();
}

export async function confirm(query) {
  const answer = await askQuestion(`${query} (Y/n): `);
  return answer.toLowerCase() !== 'n';
}

export async function selectBrowsers() {
  const allBrowsers = [
    { value: 'chrome', label: 'Chrome (MV3)' },
    { value: 'edge', label: 'Edge' },
    { value: 'firefox', label: 'Firefox' },
    { value: 'opera', label: 'Opera' },
    { value: 'naver', label: 'Naver Whale' },
    { value: 'thunderbird', label: 'Thunderbird' },
  ];

  console.log('\nSelect target browsers (comma-separated, e.g. 1,3,5):');
  allBrowsers.forEach((b, i) => console.log(`  [${i + 1}] ${b.label} (${b.value})`));

  const answer = await askQuestion('Browsers: ');
  const indices = answer.split(',').map(s => parseInt(s.trim(), 10) - 1);
  return indices.filter(i => i >= 0 && i < allBrowsers.length).map(i => allBrowsers[i].value);
}
