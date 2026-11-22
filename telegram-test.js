// Usage: npm run test-telegram — sends a test message and prints Telegram's answer
const fs = require('fs');
const path = require('path');

// Avval skript yonidagi .env ni, topilmasa loyiha ildizidagi (.cwd()) .env ni o'qiydi
const envCandidates = [
  path.join(__dirname, '.env'),
  path.resolve(process.cwd(), '.env'),
];

const envPath = envCandidates.find((p) => fs.existsSync(p));

if (!envPath) {
  console.error('.env file not found. Checked:', envCandidates.join(', '));
  process.exit(1);
}

for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const m = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (m) {
    const key = m[1];
    let val = m[2].trim();

    // Qo'shtirnoq ichida bo'lsa, faqat juft qo'shtirnoqni olib tashlaydi
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    process.env[key] = val;
  }
}

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const chat = process.env.TELEGRAM_CHAT_ID?.trim();

console.log('env file:', envPath);
console.log('token set:', Boolean(token), '| chat id:', chat || '(missing)');

if (!token || !chat) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env');
  process.exit(1);
}

if (typeof fetch !== 'function') {
  console.error('Global fetch is not available. Please use Node.js 18+.');
  process.exit(1);
}

async function run() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text: '✅ Portfolio test: bot ishlayapti!',
      }),
    });

    const data = await res.json();

    if (data.ok) {
      console.log('OK — check Telegram! (message_id:', data.result.message_id + ')');
    } else {
      console.error(`FAILED (${data.error_code ?? res.status}): ${data.description}`);
    }
  } catch (err) {
    console.error('Network or JSON error:', err.message);
    process.exit(1);
  }
}

run();