/**
 * Server tests. Needs a build first:
 *
 *   npm run build && npm run test:server
 *
 * Starts server/server.mjs as a child process against the real build, with a
 * local in-memory SMTP sink standing in for the mail server, so the whole
 * delivery path (validation → nodemailer → SMTP) runs without credentials.
 *
 * TURNSTILE_NETWORK_TESTS=1 also runs the two Turnstile cases against
 * Cloudflare's public always-pass / always-fail test keys (needs internet).
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer as createTcp } from 'node:net';
import { after, before, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const SERVER = fileURLToPath(new URL('./server.mjs', import.meta.url));

// ------------------------------------------------------------- SMTP sink
function smtpSink({ reject = false } = {}) {
  const messages = [];
  const server = createTcp((socket) => {
    let data = false;
    let buffer = '';
    let current = { from: '', to: [], body: '' };
    socket.write('220 sink ESMTP\r\n');
    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      let i;
      while ((i = buffer.indexOf('\r\n')) >= 0) {
        const line = buffer.slice(0, i);
        buffer = buffer.slice(i + 2);
        if (data) {
          if (line === '.') {
            data = false;
            messages.push(current);
            current = { from: '', to: [], body: '' };
            socket.write('250 OK queued\r\n');
          } else {
            current.body += `${line.startsWith('..') ? line.slice(1) : line}\n`;
          }
          continue;
        }
        const cmd = line.slice(0, 4).toUpperCase();
        if (cmd === 'EHLO' || cmd === 'HELO') socket.write('250-sink\r\n250 8BITMIME\r\n');
        else if (cmd === 'MAIL' && reject) socket.write('550 5.7.1 Sender rejected\r\n');
        else if (cmd === 'MAIL') (current.from = line), socket.write('250 OK\r\n');
        else if (cmd === 'RCPT') current.to.push(line), socket.write('250 OK\r\n');
        else if (cmd === 'DATA') (data = true), socket.write('354 go\r\n');
        else if (cmd === 'QUIT') socket.end('221 bye\r\n');
        else socket.write('250 OK\r\n');
      }
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, messages, port: server.address().port })));
}

async function freePort() {
  const srv = createTcp();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { port } = srv.address();
  await new Promise((r) => srv.close(r));
  return port;
}

async function start(env) {
  const port = env.PORT ? Number(env.PORT) : await freePort();
  const child = spawn(process.execPath, [SERVER], {
    env: { PATH: process.env.PATH, PORT: String(port), ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stderr.on('data', () => {});
  await new Promise((resolve, reject) => {
    child.stdout.on('data', (d) => d.toString().includes('"listening"') && resolve());
    child.on('exit', (code) => reject(new Error(`server exited ${code}`)));
  });
  return { child, base: `http://127.0.0.1:${port}`, origin: `http://127.0.0.1:${port}` };
}

const valid = (extra = {}) => ({
  name: 'Test Buyer',
  company: 'Test Trading Co',
  country: 'Bahrain',
  email: 'buyer@example.com',
  phone: '+973 1234 5678',
  buyer: 'importer',
  product: 'cartons',
  volume: '20 cartons a week',
  message: 'Line one\nLine two',
  website: '',
  elapsedMs: 8000,
  lang: 'en',
  source: 'international',
  ...extra,
});

let nextIp = 1;
/** Each request gets its own client IP unless a test sets one, so the per-IP limit only bites where intended. */
function post(ctx, body, headers = {}) {
  return fetch(`${ctx.base}/api/inquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: ctx.origin,
      'CF-Connecting-IP': `192.0.2.${nextIp++ % 250}`,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const settle = () => new Promise((r) => setTimeout(r, 150));

// ---------------------------------------------------------------- static
describe('static serving', () => {
  let ctx;
  before(async () => (ctx = await start({})));
  after(() => ctx.child.kill());

  const get = (path, init) => fetch(ctx.base + path, { redirect: 'manual', ...init });

  test('root and trailing slashes are 301s with relative locations', async () => {
    for (const [from, to] of [['/', '/ar'], ['/ar/', '/ar'], ['/en/wholesale/', '/en/wholesale'], ['/?x=1', '/ar?x=1'], ['/ar/index.html', '/ar'], ['/en/international/index.html', '/en/international']]) {
      const r = await get(from);
      assert.equal(r.status, 301, from);
      assert.equal(r.headers.get('location'), to, from);
    }
  });

  test('every page is 200 HTML with security headers and no-cache', async () => {
    for (const path of ['/ar', '/en', '/ar/wholesale', '/en/wholesale', '/ar/international', '/en/international', '/ar/privacy', '/en/privacy']) {
      const r = await get(path);
      assert.equal(r.status, 200, path);
      assert.match(r.headers.get('content-type'), /^text\/html/);
      assert.equal(r.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
      assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(r.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.match(r.headers.get('content-security-policy'), /frame-ancestors 'self'/);
      assert.equal(r.headers.get('strict-transport-security'), 'max-age=31536000');
    }
  });

  test('unknown paths get the branded 404 with a 404 status', async () => {
    const r = await get('/nope');
    assert.equal(r.status, 404);
    assert.match(await r.text(), /الصفحة غير موجودة/);
  });

  test('path traversal, dot-files and build internals are not served', async () => {
    for (const path of ['/../package.json', '/%2e%2e/package.json', '/..%2fpackage.json', '/.git/config', '/serve.json', '/index.csr.html', '/404.html']) {
      const r = await get(path);
      assert.ok([400, 404].includes(r.status), `${path} → ${r.status}`);
      assert.doesNotMatch(await r.text(), /"dependencies"|\[core\]/);
    }
  });

  test('MIME types and cache policy', async () => {
    const html = await (await get('/ar')).text();
    const js = html.match(/src="(main-[A-Z0-9]{8}\.js)"/)[1];
    const r = await get(`/${js}`);
    assert.match(r.headers.get('content-type'), /javascript/);
    assert.equal(r.headers.get('cache-control'), 'public, max-age=31536000, immutable');

    const avif = await get('/media/hero-poster-desktop-1600.avif');
    assert.equal(avif.headers.get('content-type'), 'image/avif');
    assert.equal(avif.headers.get('cache-control'), 'public, max-age=604800, stale-while-revalidate=86400');

    assert.equal((await get('/fonts/madani-arabic-400.woff2')).headers.get('content-type'), 'font/woff2');
    assert.equal((await get('/sitemap.xml')).headers.get('cache-control'), 'public, max-age=3600');
  });

  test('byte ranges for video', async () => {
    const r = await get('/media/hero-mobile.mp4', { headers: { Range: 'bytes=0-99' } });
    assert.equal(r.status, 206);
    assert.match(r.headers.get('content-range'), /^bytes 0-99\/\d+$/);
    assert.equal((await r.arrayBuffer()).byteLength, 100);

    const tail = await get('/media/hero-mobile.mp4', { headers: { Range: 'bytes=-10' } });
    assert.equal(tail.status, 206);
    assert.equal((await tail.arrayBuffer()).byteLength, 10);

    const bad = await get('/media/hero-mobile.mp4', { headers: { Range: 'bytes=999999999-' } });
    assert.equal(bad.status, 416);
  });

  test('ETag revalidation returns 304', async () => {
    const first = await get('/sitemap.xml');
    const etag = first.headers.get('etag');
    assert.ok(etag);
    const second = await get('/sitemap.xml', { headers: { 'If-None-Match': etag } });
    assert.equal(second.status, 304);
  });

  test('text is compressed when the client accepts it', async () => {
    const r = await get('/ar', { headers: { 'Accept-Encoding': 'br, gzip' } });
    assert.equal(r.headers.get('content-encoding'), 'br');
    assert.equal(r.headers.get('vary'), 'Accept-Encoding');
  });

  test('HEAD has headers and no body; other methods are refused', async () => {
    const head = await get('/ar', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal((await head.text()).length, 0);
    assert.equal((await get('/ar', { method: 'PUT' })).status, 405);
  });

  test('www redirects to the apex', async () => {
    const { request } = await import('node:http');
    const status = await new Promise((resolve) => {
      const url = new URL(ctx.base);
      request({ host: url.hostname, port: url.port, path: '/en/wholesale', headers: { Host: 'www.familyeggs.sa' } }, (res) =>
        resolve([res.statusCode, res.headers.location]),
      ).end();
    });
    assert.deepEqual(status, [301, 'https://familyeggs.sa/en/wholesale']);
  });
});

// ------------------------------------------------- inquiry: not configured
describe('inquiry API without SMTP configured', () => {
  let ctx;
  before(async () => (ctx = await start({})));
  after(() => ctx.child.kill());

  test('config says disabled, POST is 503, never cached', async () => {
    const config = await fetch(`${ctx.base}/api/inquiry/config`);
    assert.equal(config.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await config.json(), { enabled: false, turnstileSiteKey: null });
    assert.equal((await post(ctx, valid())).status, 503);
  });

  test('half a Turnstile configuration disables delivery', async () => {
    const half = await start({ SMTP_HOST: '127.0.0.1', SMTP_FROM: 'web@familyeggs.sa', TURNSTILE_SITE_KEY: 'x' });
    try {
      assert.equal((await (await fetch(`${half.base}/api/inquiry/config`)).json()).enabled, false);
    } finally {
      half.child.kill();
    }
  });
});

// ----------------------------------------------------- inquiry: configured
describe('inquiry API with SMTP configured', () => {
  let ctx;
  let sink;
  before(async () => {
    sink = await smtpSink();
    const port = await freePort();
    // Origin must match the server's own address for these tests.
    ctx = await start({
      PORT: String(port),
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(sink.port),
      SMTP_SECURE: 'false',
      SMTP_IGNORE_TLS: 'true',
      SMTP_FROM: 'website@familyeggs.sa',
      INQUIRY_TO: 'info@familyeggs.sa',
      ALLOWED_ORIGINS: `http://127.0.0.1:${port}`,
    });
  });
  after(() => {
    ctx.child.kill();
    sink.server.close();
  });

  test('config says enabled, with no Turnstile key', async () => {
    assert.deepEqual(await (await fetch(`${ctx.base}/api/inquiry/config`)).json(), { enabled: true, turnstileSiteKey: null });
  });

  test('a valid enquiry is emailed to info@ with reply-to and labelled body', async () => {
    const before = sink.messages.length;
    const r = await post(ctx, valid({ company: 'Evil Co\r\nBcc: victim@example.com' }));
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { ok: true });
    await settle();
    assert.equal(sink.messages.length, before + 1);
    const m = sink.messages.at(-1);
    assert.match(m.to.join(), /<info@familyeggs\.sa>/);
    assert.equal(m.to.length, 1, 'header injection must not add recipients');
    assert.match(m.body, /^Reply-To: Test Buyer <buyer@example\.com>$/m);
    assert.match(m.body, /^Subject: /m);
    assert.doesNotMatch(m.body, /^Bcc:/m);
    assert.match(m.body, /Type of business: Importer or distributor outside Saudi Arabia/);
    assert.match(m.body, /Line one\nLine two/);
  });

  test('Arabic enquiry gets Arabic labels', async () => {
    const r = await post(ctx, valid({ lang: 'ar', source: 'wholesale', buyer: 'distributor', email: 'a@example.com' }));
    assert.equal(r.status, 200);
    await settle();
    assert.match(sink.messages.at(-1).body, /base64|=\?UTF-8|موزع/i);
  });

  test('validation errors name the fields and send nothing', async () => {
    const before = sink.messages.length;
    const r = await post(ctx, valid({ name: '', email: 'bad', phone: '', buyer: 'pirate', country: '' }));
    assert.equal(r.status, 400);
    const body = await r.json();
    assert.equal(body.error, 'invalid');
    for (const field of ['name', 'email', 'buyer', 'country']) assert.ok(body.fields.includes(field), field);
    await settle();
    assert.equal(sink.messages.length, before);
  });

  test('honeypot and too-fast submissions look accepted but send nothing', async () => {
    const before = sink.messages.length;
    assert.equal((await post(ctx, valid({ website: 'http://spam' }))).status, 200);
    assert.equal((await post(ctx, valid({ elapsedMs: 500 }))).status, 200);
    await settle();
    assert.equal(sink.messages.length, before);
  });

  test('wrong origin, wrong type, oversize and bad JSON are refused', async () => {
    assert.equal((await post(ctx, valid(), { Origin: 'https://evil.example' })).status, 403);
    assert.equal((await post(ctx, valid(), { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await post(ctx, valid({ message: 'x'.repeat(20000) }))).status, 413);
    assert.equal((await post(ctx, '{not json')).status, 400);
    assert.equal((await post(ctx, '[1,2]')).status, 400);
    assert.equal((await fetch(`${ctx.base}/api/inquiry`)).status, 405);
  });

  test('global cap: past 30 requests in ten minutes everyone gets 429', async () => {
    const port = await freePort();
    const busy = await start({ PORT: String(port), SMTP_HOST: '127.0.0.1', SMTP_FROM: 'w@familyeggs.sa', ALLOWED_ORIGINS: `http://127.0.0.1:${port}` });
    try {
      const statuses = [];
      for (let i = 0; i < 31; i++) statuses.push((await post(busy, valid({ name: '' }))).status);
      assert.equal(statuses.filter((s) => s === 400).length, 30);
      assert.equal(statuses.at(-1), 429);
    } finally {
      busy.child.kill();
    }
  });

  test('rate limit: the sixth request in ten minutes from one IP is 429', async () => {
    const ip = { 'CF-Connecting-IP': '203.0.113.9' };
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await post(ctx, valid({ name: '' }), ip)).status);
    assert.deepEqual(statuses, [400, 400, 400, 400, 400, 429]);
  });
});

// ------------------------------------------------ inquiry: SMTP is down
describe('inquiry API when the mail server is unreachable', () => {
  let ctx;
  before(async () => {
    const port = await freePort();
    const dead = await freePort();
    ctx = await start({
      PORT: String(port),
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(dead),
      SMTP_SECURE: 'false',
      SMTP_FROM: 'website@familyeggs.sa',
      ALLOWED_ORIGINS: `http://127.0.0.1:${port}`,
    });
  });
  after(() => ctx.child.kill());

  test('returns 502 so the form shows its failure state', async () => {
    const r = await post(ctx, valid());
    assert.equal(r.status, 502);
    assert.deepEqual(await r.json(), { ok: false, error: 'send' });
  });
});

// ------------------------------------- inquiry: mail server refuses it
describe('inquiry API when the mail server rejects the message', () => {
  let ctx;
  let sink;
  before(async () => {
    sink = await smtpSink({ reject: true });
    const port = await freePort();
    ctx = await start({
      PORT: String(port),
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(sink.port),
      SMTP_SECURE: 'false',
      SMTP_IGNORE_TLS: 'true',
      SMTP_FROM: 'website@familyeggs.sa',
      ALLOWED_ORIGINS: `http://127.0.0.1:${port}`,
    });
  });
  after(() => {
    ctx.child.kill();
    sink.server.close();
  });

  test('returns 502, not a false success', async () => {
    const r = await post(ctx, valid());
    assert.equal(r.status, 502);
    assert.deepEqual(await r.json(), { ok: false, error: 'send' });
    assert.equal(sink.messages.length, 0);
  });
});

// ------------------------------------------------- Turnstile (network)
describe('Turnstile verification', { skip: !process.env.TURNSTILE_NETWORK_TESTS }, () => {
  for (const [label, secret, expected] of [
    ['always-pass test key accepts', '1x0000000000000000000000000000000AA', 200],
    ['always-fail test key rejects', '2x0000000000000000000000000000000AA', 400],
  ]) {
    test(label, async () => {
      const sink = await smtpSink();
      const port = await freePort();
      const ctx = await start({
        PORT: String(port),
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: String(sink.port),
        SMTP_SECURE: 'false',
        SMTP_IGNORE_TLS: 'true',
        SMTP_FROM: 'website@familyeggs.sa',
        ALLOWED_ORIGINS: `http://127.0.0.1:${port}`,
        TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
        TURNSTILE_SECRET_KEY: secret,
      });
      try {
        const config = await (await fetch(`${ctx.base}/api/inquiry/config`)).json();
        assert.equal(config.turnstileSiteKey, '1x00000000000000000000AA');
        assert.equal((await post(ctx, valid({ token: 'XXXX.DUMMY.TOKEN.XXXX' }))).status, expected);
        assert.equal((await post(ctx, valid({ token: '' }), { 'CF-Connecting-IP': '198.51.100.7' })).status, 400);
      } finally {
        ctx.child.kill();
        sink.server.close();
      }
    });
  }
});
