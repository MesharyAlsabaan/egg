#!/usr/bin/env node
/**
 * Static SEO check of the prerendered build. No dependencies.
 *
 *   npm run build && npm run check:seo
 *
 * For every <loc> in sitemap.xml it opens the prerendered HTML and verifies:
 * the file exists; <html lang/dir> match the URL; title and description are
 * present and unique; robots allows indexing; canonical and og:url equal the
 * <loc>; the hreflang set equals the sitemap's and is reciprocal; exactly one
 * <h1>; every <img> has an alt attribute; JSON-LD parses and contains an
 * Organization, and any FAQPage mirrors the visible questions; every internal
 * link resolves to a sitemap URL, a fragment, or a file in the build.
 * It also checks robots.txt, and that the noindex pages (privacy) exist,
 * are noindex, and are kept out of the sitemap.
 *
 * Exits 1 on any failure, so it can gate a deploy.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = 'https://familyeggs.sa';
const root = process.argv[2] ?? 'dist/family-eggs-landing/browser';

const failures = [];
const warnings = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const read = (path) => readFileSync(join(root, path), 'utf8');
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  if (m) return decode(m[1]);
  // A bare attribute (Angular serialises alt="" as just `alt`) is present
  // and empty — correct for a decorative image.
  return new RegExp(`\\s${name}(?=[\\s/>])`).test(tag) ? '' : null;
};
const text = (html) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// ------------------------------------------------------------- sitemap
const sitemap = read('sitemap.xml');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  loc: body.match(/<loc>([^<]+)<\/loc>/)[1],
  alternates: Object.fromEntries(
    [...body.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(([, l, h]) => [l, h]),
  ),
}));
if (!entries.length) fail('sitemap.xml', 'no <url> entries');
const locs = new Set(entries.map((e) => e.loc));

// -------------------------------------------------------------- robots
const robots = read('robots.txt');
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'disallows the whole site');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', 'missing Sitemap line');

// --------------------------------------------------------------- pages
const titles = new Map();
const descriptions = new Map();

for (const { loc, alternates } of entries) {
  const path = loc.replace(ORIGIN, '');
  const file = join(path.slice(1), 'index.html');
  if (!existsSync(join(root, file))) {
    fail(path, `no prerendered file at ${file}`);
    continue;
  }
  const html = read(file);
  const head = html.slice(0, html.indexOf('</head>'));
  const lang = path.split('/')[1];

  const htmlTag = html.match(/<html[^>]*>/)[0];
  if (attr(htmlTag, 'lang') !== lang) fail(path, `html lang="${attr(htmlTag, 'lang')}"`);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (attr(htmlTag, 'dir') !== dir) fail(path, `html dir="${attr(htmlTag, 'dir')}", expected ${dir}`);

  const title = text(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  if (!title) fail(path, 'missing <title>');
  else if (titles.has(title)) fail(path, `title duplicates ${titles.get(title)}`);
  else titles.set(title, path);
  if (title.length > 70) warn(path, `title is ${title.length} chars`);

  const metas = [...head.matchAll(/<meta[^>]+>/g)].map(([t]) => t);
  const meta = (key, value) =>
    metas.filter((t) => attr(t, key) === value).map((t) => attr(t, 'content'));

  const [description] = meta('name', 'description');
  if (!description) fail(path, 'missing meta description');
  else if (descriptions.has(description)) fail(path, `description duplicates ${descriptions.get(description)}`);
  else descriptions.set(description, path);
  if (description && description.length > 200) warn(path, `description is ${description.length} chars`);

  const robotsMeta = meta('name', 'robots');
  if (robotsMeta.length !== 1) fail(path, `${robotsMeta.length} robots meta tags`);
  if (robotsMeta.some((r) => /noindex/.test(r))) fail(path, 'robots meta is noindex');

  for (const key of ['og:title', 'og:description', 'og:image', 'og:url']) {
    const values = meta('property', key);
    if (values.length !== 1) fail(path, `${values.length} ${key} tags`);
  }
  if (meta('property', 'og:url')[0] !== loc) fail(path, `og:url ${meta('property', 'og:url')[0]}`);

  const links = [...head.matchAll(/<link[^>]+>/g)].map(([t]) => t);
  const canonicals = links.filter((t) => attr(t, 'rel') === 'canonical');
  if (canonicals.length !== 1) fail(path, `${canonicals.length} canonical tags`);
  else if (attr(canonicals[0], 'href') !== loc) fail(path, `canonical ${attr(canonicals[0], 'href')}`);

  const hreflang = Object.fromEntries(
    links
      .filter((t) => attr(t, 'rel') === 'alternate' && attr(t, 'hreflang'))
      .map((t) => [attr(t, 'hreflang'), attr(t, 'href')]),
  );
  if (JSON.stringify(Object.entries(hreflang).sort()) !== JSON.stringify(Object.entries(alternates).sort())) {
    fail(path, `hreflang ${JSON.stringify(hreflang)} != sitemap ${JSON.stringify(alternates)}`);
  }
  if (hreflang[lang] !== loc) fail(path, `hreflang ${lang} does not point at itself`);
  for (const [, href] of Object.entries(hreflang)) {
    if (!locs.has(href)) fail(path, `hreflang target ${href} is not in the sitemap`);
  }

  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)];
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements`);

  for (const [img] of html.matchAll(/<img[^>]*>/g)) {
    if (attr(img, 'alt') === null) fail(path, `img without alt: ${img.slice(0, 80)}`);
  }

  // JSON-LD
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) fail(path, `${blocks.length} JSON-LD blocks`);
  for (const [, json] of blocks) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    const types = (data['@graph'] ?? [data]).map((n) => n['@type']);
    if (!types.includes('Organization')) fail(path, 'JSON-LD has no Organization');
    if (path !== `/${lang}` && !types.includes('BreadcrumbList')) fail(path, 'inner page without BreadcrumbList');
    const faq = (data['@graph'] ?? []).find((n) => n['@type'] === 'FAQPage');
    if (faq) {
      const visible = new Set([...html.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/g)].map(([, q]) => text(q)));
      for (const q of faq.mainEntity) {
        if (!visible.has(q.name)) fail(path, `FAQPage question not visible on page: ${q.name}`);
      }
    }
  }

  // Internal links
  for (const [, raw] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = decode(raw);
    if (/^(https?:|mailto:|tel:|#|\/cdn-cgi\/)/.test(href) && !href.startsWith(ORIGIN)) continue;
    const target = href.replace(ORIGIN, '').split('#')[0];
    if (!target) continue;
    const absolute = target.startsWith('/') ? target : `/${target}`;
    if (!locs.has(`${ORIGIN}${absolute}`) && !existsSync(join(root, absolute))) {
      fail(path, `broken internal link ${href}`);
    }
  }
}

// ---------------------------------------------------- noindex pages
// Pages that must exist but stay out of search: present, `noindex`, absent
// from the sitemap, with a canonical to themselves.
for (const path of ['/ar/privacy', '/en/privacy']) {
  const file = join(path.slice(1), 'index.html');
  if (!existsSync(join(root, file))) {
    fail(path, `no prerendered file at ${file}`);
    continue;
  }
  if (locs.has(`${ORIGIN}${path}`)) fail(path, 'noindex page is listed in the sitemap');
  const head = read(file).slice(0, read(file).indexOf('</head>'));
  const robotsTag = [...head.matchAll(/<meta[^>]+>/g)].map(([t]) => t).find((t) => attr(t, 'name') === 'robots');
  if (!robotsTag || !/noindex/.test(attr(robotsTag, 'content'))) fail(path, 'expected robots noindex');
  const canonical = [...head.matchAll(/<link[^>]+>/g)].map(([t]) => t).find((t) => attr(t, 'rel') === 'canonical');
  if (!canonical || attr(canonical, 'href') !== `${ORIGIN}${path}`) fail(path, 'canonical does not point at itself');
}

// -------------------------------------------------------------- report
for (const w of warnings) console.warn(`warn  ${w}`);
for (const f of failures) console.error(`FAIL  ${f}`);
console.log(
  `\n${entries.length} pages checked — ${failures.length} failure(s), ${warnings.length} warning(s).`,
);
process.exit(failures.length ? 1 : 0);
