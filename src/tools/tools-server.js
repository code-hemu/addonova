import http from 'node:http';
import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {readFile, writeFile, httpsRequest, timeout} from '../build/utils.js';

const openBrowser = (url) => {
  const cmd = process.platform === 'win32' ? 'start' :
    process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${cmd} ${url}`);
};

const LOCALES_ROOT = path.resolve(process.cwd(), 'src/_locales');
const PORT = process.env.PORT || 9876;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
};

function toMessageId(message) {
  if (typeof message !== 'string') return '';
  return message.trim().split(/\s+/).slice(0, 3)
    .map(w => w.replace(/[^\w]/g, '').toLowerCase())
    .filter(Boolean).join('_');
}

function parseLocale(content) {
  const messages = new Map();
  const lines = content.split('\n');
  let id = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('@')) {
      id = line.substring(1);
    } else if (line.startsWith('#')) {
      continue;
    } else if (messages.has(id)) {
      messages.set(id, `${messages.get(id)}\n${line}`);
    } else {
      messages.set(id, line);
    }
  }
  messages.forEach((value, id) => messages.set(id, value.trim()));
  return messages;
}

function stringifyLocale(messages) {
  const lines = [];
  messages.forEach((message, id) => {
    lines.push(`@${id}`);
    const hasDoubleNewLines = /\n\n/.test(message);
    message.split('\n').filter(l => l.trim()).forEach((line, index, filtered) => {
      lines.push(line);
      if (hasDoubleNewLines && index < filtered.length - 1) lines.push('');
    });
    lines.push('');
  });
  return lines.join('\n');
}

function json2i18n(input) {
  let output = '';
  for (const key in input) {
    output += `@${key}\n${input[key].message}\n\n`;
  }
  return output;
}

async function getSupportedLocales() {
  const entries = await fs.readdir(LOCALES_ROOT).catch(() => []);
  return entries.filter(f => f.endsWith('.i18n')).map(f => f.replace('.i18n', ''));
}

async function translate(text, lang) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.search = new URLSearchParams({
    client: 'gtx', sl: 'en-US', tl: lang, dt: 't', dj: '1', q: text,
  }).toString();
  const response = await httpsRequest(url.toString());
  const data = JSON.parse(response.text());
  return data.sentences.map(s => s.trans).join('\n').replaceAll(/\n+/g, '\n');
}

function jsonResponse(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  let filePath = req.url === '/' ? '/tools.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  if (!MIME[ext]) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  fs.readFile(filePath).then(content => {
    res.writeHead(200, { 'Content-Type': MIME[ext] });
    res.end(content);
  }).catch(() => {
    res.writeHead(404);
    res.end('Not found');
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] !== 'api') return false;

  try {
    switch (parts[1]) {
      case 'locales': {
        if (parts[2]) {
          const filePath = path.join(LOCALES_ROOT, `${parts[2]}.i18n`);
          const content = await readFile(filePath).catch(() => null);
          if (!content) {
            jsonResponse(res, { error: 'Locale not found' }, 404);
            return true;
          }
          const messages = parseLocale(content);
          const obj = {};
          messages.forEach((v, k) => obj[k] = v);
          jsonResponse(res, { locale: parts[2], messages: obj });
        } else {
          const list = await getSupportedLocales();
          const data = {};
          for (const loc of list) {
            const content = await readFile(path.join(LOCALES_ROOT, `${loc}.i18n`));
            const messages = parseLocale(content);
            const obj = {};
            messages.forEach((v, k) => obj[k] = v);
            data[loc] = obj;
          }
          jsonResponse(res, { locales: list, data });
        }
        return true;
      }

      case 'translate': {
        const { text, lang } = await parseBody(req);
        if (!text || !lang) {
          jsonResponse(res, { error: 'text and lang required' }, 400);
          return true;
        }
        const result = await translate(text, lang);
        jsonResponse(res, { translated: result });
        return true;
      }

      case 'messages': {
        if (req.method !== 'POST') {
          jsonResponse(res, { error: 'Method not allowed' }, 405);
          return true;
        }

        const body = await parseBody(req);

        if (parts[2] === 'add') {
          const { message, customId } = body;
          if (!message) {
            jsonResponse(res, { error: 'message required' }, 400);
            return true;
          }

          const locales = await getSupportedLocales();
          const messageId = (customId && customId.trim()) ? customId.trim() : toMessageId(message);
          const results = { messageId, locales: {} };

          for (const locale of locales) {
            const filePath = path.join(LOCALES_ROOT, `${locale}.i18n`);
            const content = await readFile(filePath);
            const messages = parseLocale(content);

            if (locale === 'en') {
              if (!messages.has(messageId)) {
                messages.set(messageId, message);
                await writeFile(filePath, stringifyLocale(messages));
                results.locales[locale] = message;
              } else {
                results.locales[locale] = { exists: true };
              }
            } else {
              if (messages.has(messageId)) {
                results.locales[locale] = { exists: true };
              } else {
                await timeout(1000);
                const translated = await translate(message, locale);
                messages.set(messageId, translated);
                await writeFile(filePath, stringifyLocale(messages));
                results.locales[locale] = translated;
              }
            }
          }

          jsonResponse(res, results);
        } else if (parts[2] === 'delete') {
          const { messageId, targetLocale } = body;
          if (!messageId) {
            jsonResponse(res, { error: 'messageId required' }, 400);
            return true;
          }

          const locales = targetLocale ? [targetLocale] : await getSupportedLocales();
          const deleted = [];

          for (const locale of locales) {
            const filePath = path.join(LOCALES_ROOT, `${locale}.i18n`);
            try {
              const content = await readFile(filePath);
              const messages = parseLocale(content);
              if (messages.has(messageId)) {
                messages.delete(messageId);
                await writeFile(filePath, stringifyLocale(messages));
                deleted.push(locale);
              }
            } catch { /* skip missing */ }
          }

          jsonResponse(res, { deleted });
        } else {
          jsonResponse(res, { error: 'Unknown action' }, 400);
        }
        return true;
      }

      case 'json2i18n': {
        if (req.method !== 'POST') {
          jsonResponse(res, { error: 'Method not allowed' }, 405);
          return true;
        }
        const body = await parseBody(req);
        if (!body.json) {
          jsonResponse(res, { error: 'json field required' }, 400);
          return true;
        }
        const result = json2i18n(body.json);
        jsonResponse(res, { i18n: result });
        return true;
      }

      default:
        jsonResponse(res, { error: 'Unknown endpoint' }, 404);
        return true;
    }
  } catch (err) {
    jsonResponse(res, { error: err.message }, 500);
    return true;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    await handleAPI(req, res);
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Addonova Tools UI → ${url}`);
  console.log(`Working directory locales: ${LOCALES_ROOT}`);
  openBrowser(url);
});
