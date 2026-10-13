#!/usr/bin/env node
/**
 * Checks internal links and #anchors across the docs site. No dependencies.
 *
 *   node scripts/check-links.mjs                      # crawl the running server (http://localhost:$PORT, default 3410)
 *   node scripts/check-links.mjs --base http://host   # crawl another server
 *   node scripts/check-links.mjs --out out            # analyse a static export (pnpm build:static)
 *
 * Pages come from /sitemap.xml (server) or every *.html file (static export). Every same-origin <a href>
 * must resolve (a crawled page, or a route/asset answering < 400) and every #fragment must match an
 * id on the target page. MDX/Markdown sources in content/docs are scanned too, so links inside
 * client-only UI (closed tabs, dialogs) are still checked. Exits 1 when anything is broken.
 *
 * Options: --concurrency <n> (default 8), --quiet (summary only).
 */
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const outDir = option('out', null);
const base = (option('base', null) || `http://localhost:${process.env.PORT || 3410}`).replace(/\/+$/, '');
const concurrency = Number(option('concurrency', 8));
const quiet = args.includes('--quiet');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
const origin = new URL(base).origin;
const started = Date.now();

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Site path without base path, query or trailing slash ("/" stays "/"). */
const normalize = (pathname) => {
  let value = pathname;
  if (basePath && (value === basePath || value.startsWith(`${basePath}/`))) value = value.slice(basePath.length) || '/';
  value = value.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return value.length > 1 ? value.replace(/\/+$/, '') : value;
};

/** Absolute URL a page is served at (static exports use trailing slashes), for resolving relative hrefs. */
const pageUrl = (pagePath) => `${origin}${basePath}${pagePath}${outDir && pagePath !== '/' ? '/' : ''}`;

/** Ids (and legacy <a name>) a fragment can target. */
const collectIds = (html) => {
  const ids = new Set();
  for (const match of html.matchAll(/\s(?:id|name)="([^"]+)"/g)) ids.add(decode(match[1]));
  return ids;
};

/** Same-site links: { path, hash } from <a href>, skipping other origins and non-http schemes. */
const collectLinks = (html, pagePath) => {
  const links = [];
  // Only real anchors in the document, not the RSC payload or <template> examples inside code blocks.
  const body = html.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<pre\b[\s\S]*?<\/pre>/g, '');
  for (const match of body.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
    const href = decode(match[1]).trim();
    if (!href || /^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, pageUrl(pagePath));
    } catch {
      links.push({ href, path: null, hash: '' });
      continue;
    }
    if (url.origin !== origin) continue;
    links.push({ href, path: normalize(url.pathname), hash: decodeURIComponent(url.hash.slice(1)) });
  }
  return links;
};

async function pool(items, worker) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (queue.length) await worker(queue.shift());
    })
  );
}

async function walk(dir, filter) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name), filter) : filter(entry.name) ? [path.join(dir, entry.name)] : [])));
  return files.flat();
}

/* ---------- Sources: pages and a resolver for non-page targets ---------- */

/** pagePath -> { ids, links } */
const pages = new Map();
/** Cache for targets that are not crawled pages: path -> { ok, status, ids? } */
const targets = new Map();

async function loadFromServer() {
  const response = await fetch(`${base}${basePath}/sitemap.xml`).catch((error) => {
    throw new Error(`Cannot reach ${base} (${error.cause?.code || error.message}). Start the site (pnpm dev) or pass --out <dir>.`);
  });
  if (!response.ok) throw new Error(`${base}${basePath}/sitemap.xml answered ${response.status}`);
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalize(new URL(decode(match[1])).pathname));
  if (!paths.length) throw new Error('The sitemap lists no pages.');
  let done = 0;
  await pool(paths, async (pagePath) => {
    const res = await fetch(`${base}${basePath}${pagePath}`, { redirect: 'follow' });
    const html = res.ok ? await res.text() : '';
    pages.set(pagePath, { status: res.status, ids: collectIds(html), links: collectLinks(html, pagePath) });
    done += 1;
    if (!quiet && process.stdout.isTTY) process.stdout.write(`\rCrawled ${done}/${paths.length}`);
  });
  if (!quiet && process.stdout.isTTY) process.stdout.write('\n');
}

async function resolveOnServer(targetPath) {
  if (targets.has(targetPath)) return targets.get(targetPath);
  const promise = (async () => {
    const res = await fetch(`${base}${basePath}${targetPath}`, { redirect: 'follow' });
    const type = res.headers.get('content-type') || '';
    const ids = type.includes('text/html') ? collectIds(await res.text()) : null;
    if (!ids) await res.body?.cancel();
    return { ok: res.status < 400, status: res.status, ids };
  })().catch((error) => ({ ok: false, status: error.message, ids: null }));
  targets.set(targetPath, promise);
  return promise;
}

async function loadFromExport() {
  const dir = path.resolve(root, outDir);
  if (!existsSync(dir)) throw new Error(`${dir} does not exist. Run pnpm build:static first.`);
  const files = await walk(dir, (name) => name.endsWith('.html'));
  await pool(files, async (file) => {
    const relative = `/${path.relative(dir, file).split(path.sep).join('/')}`;
    if (/^\/(404|_not-found|_error)(\/index)?\.html$/.test(relative)) return;
    const pagePath = normalize(relative);
    const html = await readFile(file, 'utf8');
    pages.set(pagePath, { status: 200, ids: collectIds(html), links: collectLinks(html, pagePath) });
  });
}

async function resolveInExport(targetPath) {
  if (targets.has(targetPath)) return targets.get(targetPath);
  const dir = path.resolve(root, outDir);
  const candidates = [targetPath, `${targetPath}/index.html`, `${targetPath}.html`].map((candidate) => path.join(dir, candidate));
  for (const candidate of candidates) {
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) {
      const ids = candidate.endsWith('.html') ? collectIds(await readFile(candidate, 'utf8')) : null;
      const result = { ok: true, status: 200, ids };
      targets.set(targetPath, result);
      return result;
    }
  }
  const result = { ok: false, status: 'no such file', ids: null };
  targets.set(targetPath, result);
  return result;
}

const resolveTarget = outDir ? resolveInExport : resolveOnServer;

/* ---------- Checks ---------- */

/** problem key -> { reason, sources: Set } */
const problems = new Map();
const report = (target, reason, source) => {
  const key = `${target}\u0000${reason}`;
  if (!problems.has(key)) problems.set(key, { target, reason, sources: new Set() });
  problems.get(key).sources.add(source);
};

async function checkLink(link, sourcePath, sourceLabel) {
  if (link.path === null) return report(link.href, 'invalid URL', sourceLabel);
  const targetPath = link.path || sourcePath;
  const display = `${targetPath}${link.hash ? `#${link.hash}` : ''}`;
  const page = pages.get(targetPath);
  let ids;
  if (page) {
    if (page.status >= 400) return report(display, `page answered ${page.status}`, sourceLabel);
    ids = page.ids;
  } else {
    const target = await resolveTarget(targetPath);
    if (!target.ok) return report(display, `target answered ${target.status}`, sourceLabel);
    ids = target.ids;
  }
  if (link.hash && ids && !ids.has(link.hash)) report(display, 'missing anchor', sourceLabel);
}

/** Markdown links and href attributes in content/docs, resolved against the crawled pages. */
async function contentLinks() {
  const dir = path.join(root, 'content/docs');
  if (!existsSync(dir)) return [];
  const files = await walk(dir, (name) => /\.mdx?$/.test(name));
  const found = [];
  for (const file of files) {
    const relative = path.relative(dir, file).split(path.sep).join('/');
    const pagePath = normalize(`/docs/${relative.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')}`);
    const lines = (await readFile(file, 'utf8')).split('\n');
    let fenced = false;
    lines.forEach((line, index) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (fenced) return;
      const code = line.replace(/`[^`]*`/g, '');
      for (const match of code.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\)|\bhref=["']([^"']+)["']/g)) {
        const href = (match[1] || match[2]).trim();
        if (!/^(\/|#)/.test(href) || href.startsWith('//')) continue;
        const url = new URL(href, pageUrl(pagePath));
        found.push({ link: { href, path: href.startsWith('#') ? pagePath : normalize(url.pathname), hash: decodeURIComponent(url.hash.slice(1)) }, pagePath, label: `content/docs/${relative}:${index + 1}` });
      }
    });
  }
  return found;
}

try {
  if (outDir) await loadFromExport();
  else await loadFromServer();

  const checks = [];
  for (const [pagePath, page] of pages) {
    if (page.status >= 400) report(pagePath, `page answered ${page.status}`, 'sitemap.xml');
    for (const link of page.links) checks.push({ link, pagePath, label: pagePath });
  }
  const fromContent = await contentLinks();
  checks.push(...fromContent);
  await pool(checks, ({ link, pagePath, label }) => checkLink(link, pagePath, label));

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const linkCount = checks.length;
  const sorted = [...problems.values()].sort((a, b) => a.reason.localeCompare(b.reason) || a.target.localeCompare(b.target));
  if (sorted.length) {
    console.error(`\nBroken links (${sorted.length} targets):`);
    for (const problem of sorted) {
      const sources = [...problem.sources].sort();
      console.error(`  ✗ ${problem.target}  (${problem.reason})`);
      if (!quiet) for (const source of sources.slice(0, 5)) console.error(`      from ${source}`);
      if (!quiet && sources.length > 5) console.error(`      … and ${sources.length - 5} more`);
    }
  }
  const summary = `${pages.size} pages, ${linkCount} links (${fromContent.length} from MDX sources), ${targets.size} other targets checked in ${seconds}s`;
  if (sorted.length) {
    console.error(`\n${summary}: ${sorted.length} broken.`);
    process.exit(1);
  }
  console.log(`${summary}: no broken links.`);
} catch (error) {
  console.error(`check-links: ${error.message}`);
  process.exit(2);
}
