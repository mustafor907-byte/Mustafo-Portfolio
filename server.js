'use strict';

/**
 * Portfolio server (Express)
 *   npm start            -> http://localhost:3000
 *
 * - serves ONLY the public site files (never server.js, package.json, data/)
 * - POST /api/contact   -> saves the message to data/messages.json
 *                          and forwards it to Telegram (TELEGRAM_BOT_TOKEN and
 *                          TELEGRAM_CHAT_ID are read from the .env file)
 */

const path = require('path');
const fs = require('fs/promises');
const express = require('express');

// Minimal .env loader (keeps secrets like the Telegram token out of the code)
try {
  for (const line of require('fs').readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {
  /* no .env file — fine */
}

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

/* ---------------- Static files (whitelist) ---------------- */
app.use('/css', express.static(path.join(ROOT, 'css'), { maxAge: '1h' }));
app.use('/images', express.static(path.join(ROOT, 'images'), { maxAge: '7d' }));
app.get('/script.js', (req, res) => res.sendFile(path.join(ROOT, 'script.js')));
app.get('/projects.js', (req, res) => res.sendFile(path.join(ROOT, 'projects.js')));
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

/* ---------------- Contact form ---------------- */
const hits = new Map(); // ip -> [timestamps]
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) {
    const recent = list.filter((t) => now - t < WINDOW_MS);
    recent.length ? hits.set(ip, recent) : hits.delete(ip);
  }
}, WINDOW_MS).unref();

// writes happen one after another so the JSON file never gets corrupted
let writeQueue = Promise.resolve();
function saveMessage(entry) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let list = [];
    try {
      list = JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8'));
    } catch (_) {
      /* first message */
    }
    list.push(entry);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(list, null, 2));
  });
  return writeQueue;
}

async function notifyTelegram(m) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.warn('Telegram: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set in .env — message saved to file only.');
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: `📩 New portfolio message\n\n👤 ${m.name}\n✉️ ${m.email}\n\n${m.message}` }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) console.log('Telegram: message delivered ✔');
    else console.error('Telegram FAILED:', res.status, data.description || '');
  } catch (err) {
    console.error('Telegram network error:', err.message);
  }
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message, website } = req.body || {};

  // honeypot: bots fill the hidden field — pretend everything is fine
  if (website) return res.json({ ok: true });

  if (isLimited(req.ip)) {
    return res.status(429).json({ ok: false, error: 'Too many messages, try again later.' });
  }

  const clean = {
    name: String(name || '').trim(),
    email: String(email || '').trim(),
    message: String(message || '').trim(),
  };
  const valid =
    clean.name.length >= 2 &&
    clean.name.length <= 80 &&
    /^\S+@\S+\.\S+$/.test(clean.email) &&
    clean.email.length <= 120 &&
    clean.message.length >= 5 &&
    clean.message.length <= 2000;

  if (!valid) return res.status(400).json({ ok: false, error: 'Invalid data.' });

  try {
    const entry = { ...clean, date: new Date().toISOString() };
    await saveMessage(entry);
    notifyTelegram(entry); // fire and forget
    res.json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ ok: false, error: 'Server error.' });
  }
});

/* ---------------- Errors ---------------- */
app.use((req, res) => res.status(404).type('text').send('Not found'));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
    return res.status(400).json({ ok: false, error: 'Bad request.' });
  }
  console.error(err);
  res.status(500).json({ ok: false, error: 'Server error.' });
});

app.listen(PORT, () => {
  console.log(`Portfolio running → http://localhost:${PORT}`);
  console.log(`Telegram: ${process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID ? 'configured (.env loaded)' : 'NOT configured — check the .env file'}`);
});
