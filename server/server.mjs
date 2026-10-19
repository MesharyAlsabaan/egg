#!/usr/bin/env node
/**
 * Production server for familyeggs.sa.
 *
 * Replaces `serve` so the site can accept enquiries itself. Two jobs:
 *
 * 1. Serve the prerendered build exactly as `serve` + public/serve.json did:
 *    `/` → 301 /ar, trailing slash → 301, branded 404, the same cache and
 *    security headers, correct MIME types (AVIF included), byte ranges for
 *    video, ETag/304 and gzip/brotli for text.
 * 2. `POST /api/inquiry` and `GET /api/inquiry/config` (server/inquiry.mjs).
 *    Delivery is OFF until SMTP is configured through environment variables;
 *    until then the form falls back to its WhatsApp/email hand-off.
 *
 * No framework, one dependency (nodemailer, loaded only when mail is
 * configured). `npm run serve:static` keeps the old `serve` path as a rollback.
 *
 *   PORT=8080 node server/server.mjs
 */
import { createReadStream, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants as zlib, gzipSync } from 'node:zlib';

import { handleInquiry, inquiryConfig } from './inquiry.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(process.env.STATIC_ROOT ?? join(HERE, '..', 'dist/family-eggs-landing/browser'));
const PORT = Number(process.env.PORT ?? 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

/** Build artefacts that exist in the output but must never be served. */
const PRIVATE = new Set(['/serve.json', '/index.csr.html', '/404.html']);

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000',
  // Only directives that cannot break a script or style: framing, <base>,
  // plugins and where forms may post (the no-JS form posts to mailto:).
  'Content-Security-Policy': "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self' mailto:",
};

/** Same policy as public/serve.json — keep the two in step. */
function cacheControl(path) {
  if (/^\/[^/]+-[A-Z0-9]{8}\.(?:js|css)$/.test(path)) return 'public, max-age=31536000, immutable';
  if (/^\/(?:fonts|media|brand)\//.test(path)) return 'public, max-age=604800, stale-while-revalidate=86400';
  if (path === '/sitemap.xml' || path === '/robots.txt') return 'public, max-age=3600';
  return 'public, max-age=0, must-revalidate';
}

const compressed = new Map(); // `${path}:${mtime}:${encoding}` → Buffer

function send(res, status, headers, body) {
  res.writeHead(status, { ...SECURITY, ...headers });
  res.end(body);
}

function redirect(res, location) {
  send(res, 301, { Location: location, 'Cache-Control': 'public, max-age=3600' }, '');
}

async function statFile(path) {
  try {
    const s = await fs.stat(path);
    return s.isFile() ? s : null;
  } catch {
    return null;
  }
}

async function notFound(req, res) {
  const file = join(ROOT, '404.html');
  const body = await fs.readFile(file).catch(() => Buffer.from('Not found'));
  send(
    res,
    404,
    { 'Content-Type': MIME['.html'], 'Cache-Control': 'public, max-age=0, must-revalidate' },
    req.method === 'HEAD' ? '' : body,
  );
}

async function serveStatic(req, res, url) {
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, { 'Content-Type': 'text/plain' }, 'Bad request');
  }
  if (path.includes('\0')) return send(res, 400, { 'Content-Type': 'text/plain' }, 'Bad request');

  if (path === '/') return redirect(res, `/ar${url.search}`);
  if (path.length > 1 && path.endsWith('/')) return redirect(res, `${path.replace(/\/+$/, '')}${url.search}`);
  // `/ar/index.html` is the same page as `/ar`; one URL per page.
  if (path.endsWith('/index.html')) return redirect(res, `${path.slice(0, -'/index.html'.length) || '/'}${url.search}`);

  // Containment: the resolved file must stay inside ROOT, and no dot-files.
  const target = normalize(join(ROOT, path));
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return notFound(req, res);
  if (path.split('/').some((part) => part.startsWith('.')) || PRIVATE.has(path)) return notFound(req, res);

  let file = target;
  let stat = await statFile(file);
  if (!stat) {
    file = join(target, 'index.html');
    stat = await statFile(file);
  }
  if (!stat) return notFound(req, res);

  const ext = extname(file).toLowerCase();
  const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
  const headers = {
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Cache-Control': cacheControl(path),
    ETag: etag,
    'Last-Modified': stat.mtime.toUTCString(),
    'Accept-Ranges': 'bytes',
  };
  if (COMPRESSIBLE.has(ext)) headers.Vary = 'Accept-Encoding';

  if (req.headers['if-none-match'] === etag) return send(res, 304, headers, '');

  // Byte ranges — Safari will not play video without them.
  const range = req.headers.range;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    let start = m && m[1] !== '' ? Number(m[1]) : NaN;
    let end = m && m[2] !== '' ? Number(m[2]) : NaN;
    if (m && m[1] === '' && m[2] !== '') {
      start = Math.max(stat.size - Number(m[2]), 0);
      end = stat.size - 1;
    } else if (!Number.isNaN(start) && Number.isNaN(end)) {
      end = stat.size - 1;
    }
    if (!m || Number.isNaN(start) || start > end || start >= stat.size) {
      return send(res, 416, { 'Content-Range': `bytes */${stat.size}` }, '');
    }
    end = Math.min(end, stat.size - 1);
    res.writeHead(206, {
      ...SECURITY,
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': end - start + 1,
    });
    if (req.method === 'HEAD') return res.end();
    return createReadStream(file, { start, end }).pipe(res);
  }

  const accept = String(req.headers['accept-encoding'] ?? '');
  const encoding =
    COMPRESSIBLE.has(ext) && stat.size > 1024
      ? /\bbr\b/.test(accept)
        ? 'br'
        : /\bgzip\b/.test(accept)
          ? 'gzip'
          : null
      : null;

  if (encoding) {
    const key = `${file}:${stat.mtimeMs}:${encoding}`;
    let body = compressed.get(key);
    if (!body) {
      const raw = await fs.readFile(file);
      body =
        encoding === 'br'
          ? brotliCompressSync(raw, { params: { [zlib.BROTLI_PARAM_QUALITY]: 10 } })
          : gzipSync(raw, { level: 9 });
      compressed.set(key, body);
    }
    return send(
      res,
      200,
      { ...headers, 'Content-Encoding': encoding, 'Content-Length': body.length },
      req.method === 'HEAD' ? '' : body,
    );
  }

  res.writeHead(200, { ...SECURITY, ...headers, 'Content-Length': stat.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');

    // www → apex. Cloudflare should do this at the edge; this covers the
    // case where www is ever pointed at the origin directly.
    const host = String(req.headers.host ?? '');
    if (host.startsWith('www.')) {
      return redirect(res, `https://${host.slice(4)}${url.pathname}${url.search}`);
    }

    if (url.pathname.startsWith('/api/')) {
      const api = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' };
      if (url.pathname === '/api/inquiry/config' && req.method === 'GET') {
        return send(res, 200, api, JSON.stringify(inquiryConfig()));
      }
      if (url.pathname === '/api/inquiry') {
        if (req.method !== 'POST') return send(res, 405, { ...api, Allow: 'POST' }, '{"ok":false}');
        const { status, body, headers } = await handleInquiry(req);
        return send(res, status, { ...api, ...headers }, JSON.stringify(body));
      }
      return send(res, 404, api, '{"ok":false}');
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain' }, 'Method not allowed');
    }
    await serveStatic(req, res, url);
  } catch (error) {
    console.error(JSON.stringify({ evt: 'server_error', message: String(error?.message ?? error) }));
    if (!res.headersSent) send(res, 500, { 'Content-Type': 'text/plain' }, 'Internal error');
    else res.destroy();
  }
});

server.listen(PORT, () => {
  const cfg = inquiryConfig();
  console.log(
    JSON.stringify({ evt: 'listening', port: PORT, root: ROOT, inquiryDelivery: cfg.enabled, turnstile: !!cfg.turnstileSiteKey }),
  );
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
