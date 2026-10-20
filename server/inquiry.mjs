/**
 * Server-side delivery of commercial enquiries.
 *
 * OFF by default. It turns on only when SMTP is configured through
 * environment variables (see docs/seo-growth/14-REMAINING-EXTERNAL-ACTIONS.md):
 *
 *   SMTP_HOST, SMTP_PORT (465), SMTP_SECURE ("true" for 465), SMTP_USER,
 *   SMTP_PASS, SMTP_FROM (defaults to SMTP_USER), INQUIRY_TO (defaults to
 *   info@familyeggs.sa), TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY (optional,
 *   both or neither), ALLOWED_ORIGINS (comma list; defaults to the site).
 *
 * Nothing is stored: the enquiry is validated, emailed, and forgotten. Logs
 * carry labels only (buyer type, page, language) — never what was typed.
 *
 * Spam defences, cheapest first: same-origin check, JSON-only, 16 KB cap,
 * per-IP rate limit, a honeypot field, a minimum fill time, and Cloudflare
 * Turnstile when its keys are set. Validation mirrors the browser's exactly;
 * the browser's is for the visitor, this one is the one that counts.
 */

const env = process.env;

const BUYERS = ['distributor', 'retail', 'horeca', 'institutional', 'importer', 'other'];
const PRODUCTS = ['', 'cartons', 'trays', 'both', 'unsure'];
const SOURCES = ['wholesale', 'international'];
const LIMITS = { name: 120, company: 160, country: 80, email: 160, phone: 24, volume: 120, message: 1000 };
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;
const MIN_FILL_MS = 3000;
const MAX_BODY = 16 * 1024;
const RATE = { windowMs: 10 * 60 * 1000, max: 5 };
/**
 * Ceiling across ALL clients. The per-IP limit trusts CF-Connecting-IP, which
 * a client hitting the Railway origin directly could forge; this cap holds
 * regardless, so the inbox cannot be flooded either way.
 */
const GLOBAL = { windowMs: 10 * 60 * 1000, max: 30 };

/** Labels for the email the company receives, in the visitor's language. */
const LABELS = {
  ar: {
    heading: 'طلب توريد عبر موقع بيض العائلة',
    name: 'الاسم', company: 'الشركة', country: 'الدولة', buyer: 'نوع النشاط', product: 'العبوة',
    volume: 'الكمية التقريبية', email: 'البريد الإلكتروني', phone: 'الهاتف', message: 'تفاصيل إضافية', page: 'الصفحة',
    buyers: { distributor: 'موزع أو تاجر جملة', retail: 'سوق أو منفذ تجزئة', horeca: 'مطعم أو فندق أو شركة تموين', institutional: 'جهة مؤسسية', importer: 'مستورد أو موزع خارج المملكة', other: 'أخرى' },
    products: { cartons: 'كرتون (360 بيضة)', trays: 'طبق (30 بيضة)', both: 'الاثنان', unsure: 'لم يحدد بعد' },
  },
  en: {
    heading: 'Supply enquiry via the Family Eggs website',
    name: 'Name', company: 'Company', country: 'Country', buyer: 'Type of business', product: 'Pack',
    volume: 'Approximate volume', email: 'Email', phone: 'Phone', message: 'Details', page: 'Page',
    buyers: { distributor: 'Distributor or wholesaler', retail: 'Supermarket or retailer', horeca: 'Restaurant, hotel or caterer', institutional: 'Institutional buyer', importer: 'Importer or distributor outside Saudi Arabia', other: 'Other' },
    products: { cartons: 'Carton (360 eggs)', trays: 'Tray (30 eggs)', both: 'Both', unsure: 'Not decided yet' },
  },
};

function settings() {
  const turnstileSite = env.TURNSTILE_SITE_KEY ?? '';
  const turnstileSecret = env.TURNSTILE_SECRET_KEY ?? '';
  const from = env.SMTP_FROM || env.SMTP_USER || '';
  const smtp = !!(env.SMTP_HOST && from);
  // Half a Turnstile configuration is a mistake, not "Turnstile off": refuse
  // to run unprotected rather than silently dropping the check.
  const turnstileMismatch = !!turnstileSite !== !!turnstileSecret;
  return {
    enabled: smtp && !turnstileMismatch,
    turnstileMismatch,
    turnstileSite,
    turnstileSecret,
    from,
    to: env.INQUIRY_TO || 'info@familyeggs.sa',
    origins: (env.ALLOWED_ORIGINS || 'https://familyeggs.sa,https://www.familyeggs.sa')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  };
}

if (settings().turnstileMismatch) {
  console.error(JSON.stringify({ evt: 'config_error', message: 'Set both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY, or neither. Enquiry delivery is disabled.' }));
}

/** What the browser needs to choose its mode. Never exposes a secret. */
export function inquiryConfig() {
  const s = settings();
  return { enabled: s.enabled, turnstileSiteKey: s.enabled && s.turnstileSite ? s.turnstileSite : null };
}

// ------------------------------------------------------------ rate limit
const hits = new Map(); // ip → [timestamps]
let all = []; // timestamps, every client

/**
 * Forget an IP once its window has passed. The privacy notice says the
 * address is held "for about ten minutes" — this sweep is what makes that
 * true (window + at most one sweep interval). Nothing here is ever logged.
 */
function sweep(now = Date.now()) {
  for (const [key, list] of hits) {
    if (!list.some((t) => now - t < RATE.windowMs)) hits.delete(key);
  }
}
setInterval(sweep, 60 * 1000).unref();

function limited(ip) {
  const now = Date.now();
  all = all.filter((t) => now - t < GLOBAL.windowMs);
  all.push(now);
  if (all.length > GLOBAL.max) return true;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) sweep(now);
  return recent.length > RATE.max;
}

function clientIp(req) {
  // Behind Cloudflare the visitor's address is CF-Connecting-IP; Railway's
  // proxy adds X-Forwarded-For. The socket address is the last resort.
  return (
    String(req.headers['cf-connecting-ip'] ?? '').trim() ||
    String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        // Stop reading and answer; `Connection: close` (set by the caller)
        // ends the socket once the 413 is out, so the rest is never read.
        req.pause();
        req.removeAllListeners('data');
        reject(Object.assign(new Error('too large'), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** Trim, collapse control characters (CR/LF included) and cap the length. */
function clean(value, max, multiline = false) {
  if (typeof value !== 'string') return '';
  let s = value.replace(/\r\n?/g, '\n');
  s = multiline ? s.replace(/[^\S\n]+/g, ' ') : s.replace(/\s+/g, ' ');
  // eslint-disable-next-line no-control-regex
  s = s.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '');
  return s.trim().slice(0, max);
}

export function validate(input) {
  const v = {
    name: clean(input.name, LIMITS.name),
    company: clean(input.company, LIMITS.company),
    country: clean(input.country, LIMITS.country),
    email: clean(input.email, LIMITS.email),
    phone: clean(input.phone, LIMITS.phone),
    buyer: clean(input.buyer, 20),
    product: clean(input.product, 20),
    volume: clean(input.volume, LIMITS.volume),
    message: clean(input.message, LIMITS.message, true),
    lang: input.lang === 'ar' ? 'ar' : 'en',
    source: clean(input.source, 20),
  };
  const errors = [];
  if (!v.name) errors.push('name');
  if (!v.company) errors.push('company');
  if (!BUYERS.includes(v.buyer)) errors.push('buyer');
  if (!PRODUCTS.includes(v.product)) errors.push('product');
  if (!SOURCES.includes(v.source)) errors.push('source');
  if (v.source === 'international' && !v.country) errors.push('country');
  if (v.email && !EMAIL.test(v.email)) errors.push('email');
  if (v.phone && !PHONE.test(v.phone)) errors.push('phone');
  if (!v.email && !v.phone) errors.push('email', 'phone');
  return { value: v, errors };
}

async function verifyTurnstile(secret, token, ip) {
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

let transport;
async function mailer() {
  if (!transport) {
    const { default: nodemailer } = await import('nodemailer');
    const port = Number(env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? '' } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      // Local test sinks only; production always negotiates TLS.
      ignoreTLS: env.SMTP_IGNORE_TLS === 'true',
    });
  }
  return transport;
}

function compose(v, page) {
  const L = LABELS[v.lang];
  const rows = [
    [L.name, v.name],
    [L.company, v.company],
    [L.country, v.country],
    [L.buyer, L.buyers[v.buyer] ?? v.buyer],
    [L.product, v.product ? L.products[v.product] : ''],
    [L.volume, v.volume],
    [L.email, v.email],
    [L.phone, v.phone],
  ].filter(([, value]) => value);
  const lines = rows.map(([k, value]) => `${k}: ${value}`);
  if (v.message) lines.push('', `${L.message}:`, v.message);
  lines.push('', `${L.page}: ${page}`);
  return {
    subject: `${L.heading} — ${v.company}`.slice(0, 180),
    text: [L.heading, '', ...lines].join('\n'),
  };
}

/** Returns { status, body, headers? }. Never throws. */
export async function handleInquiry(req) {
  const s = settings();
  if (!s.enabled) return { status: 503, body: { ok: false, error: 'unavailable' } };

  const origin = String(req.headers.origin ?? '');
  if (!s.origins.includes(origin)) return { status: 403, body: { ok: false, error: 'origin' } };
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
    return { status: 415, body: { ok: false, error: 'type' } };
  }

  const ip = clientIp(req);
  if (limited(ip)) {
    return { status: 429, body: { ok: false, error: 'busy' }, headers: { 'Retry-After': String(RATE.windowMs / 1000) } };
  }

  let input;
  try {
    input = JSON.parse(await readBody(req));
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('shape');
  } catch (error) {
    if (error.status === 413) {
      return { status: 413, body: { ok: false, error: 'too_large' }, headers: { Connection: 'close' } };
    }
    return { status: 400, body: { ok: false, error: 'invalid' } };
  }

  // Bots: report success and send nothing, so there is no signal to tune against.
  const elapsed = Number(input.elapsedMs);
  if ((typeof input.website === 'string' && input.website.trim()) || !(elapsed >= MIN_FILL_MS)) {
    console.log(JSON.stringify({ evt: 'inquiry_dropped', reason: input.website ? 'honeypot' : 'too_fast' }));
    return { status: 200, body: { ok: true } };
  }

  const { value, errors } = validate(input);
  if (errors.length) return { status: 400, body: { ok: false, error: 'invalid', fields: [...new Set(errors)] } };

  if (s.turnstileSecret && !(await verifyTurnstile(s.turnstileSecret, input.token, ip))) {
    return { status: 400, body: { ok: false, error: 'captcha' } };
  }

  const page = `${s.origins[0]}/${value.lang}/${value.source}`;
  const { subject, text } = compose(value, page);
  try {
    const mail = await mailer();
    await mail.sendMail({
      from: { name: 'Family Eggs website', address: s.from },
      to: s.to,
      replyTo: value.email ? { name: value.name, address: value.email } : undefined,
      subject,
      text,
    });
  } catch (error) {
    console.error(JSON.stringify({ evt: 'inquiry_send_failed', code: error?.code ?? 'unknown' }));
    return { status: 502, body: { ok: false, error: 'send' } };
  }

  console.log(JSON.stringify({ evt: 'inquiry_sent', buyer: value.buyer, source: value.source, lang: value.lang }));
  return { status: 200, body: { ok: true } };
}
