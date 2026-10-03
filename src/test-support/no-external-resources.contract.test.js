import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

/*
 * Gaudi and its Storybook never load anything from the network: no third-party images, iframes,
 * scripts, stylesheets, fonts, CSS url()s, fetches or service URLs. Sample data stays realistic
 * through local assets (.storybook/public) and static mocks. Plain link targets (href, `url` fields,
 * link text) are fine: they are only followed when someone clicks them.
 *
 * The scan covers src/** and .storybook/** source, styles, HTML and SVG. It skips docs (.md),
 * binary assets, the generated story catalogue, verification snapshots and the contract tests
 * themselves (they run in Node and never load resources).
 */

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const scanned = [ 'src', '.storybook' ];
const extensions = new Set([ '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mdx', '.json', '.css', '.html', '.svg' ]);
const skipped = [
  /(^|\/)node_modules\//,
  /^\.storybook\/verification\//,
  /^\.storybook\/fixtures\/catalogue\.json$/,
  /\.test\.(js|jsx|mjs)$/
];

const URL_START = String.raw`(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}`;

// Each rule names how a URL would be loaded.
const rules = [
  // src=, srcSet=, poster=, data= on img, iframe, video, audio, source, script, object, embed.
  { 'name': 'resource attribute', 'pattern': new RegExp(String.raw`\b(?:src|srcset|srcSet|poster|data|videoSrc|thumbnailSrc)\s*=\s*\{?\s*[\`'"]${URL_START}`, 'g') },
  // Image-like fields in data: { avatar: 'https://…' }, assigneeAvatar, coverImage, favicon…
  { 'name': 'image field', 'pattern': new RegExp(String.raw`['"]?\b[A-Za-z]*(?:src|Src|avatar|Avatar|image|Image|thumbnail|Thumbnail|favicon|Favicon|poster|Poster|cover|Cover|photo|Photo|logo|Logo|icon|Icon|picture|Picture)['"]?\s*:\s*[\`'"]${URL_START}`, 'g') },
  // CSS url(), @import and stylesheet links.
  { 'name': 'css url()', 'pattern': new RegExp(String.raw`url\(\s*['"]?${URL_START}`, 'g') },
  { 'name': '@import', 'pattern': new RegExp(String.raw`@import\s+(?:url\()?\s*['"]?${URL_START}`, 'g') },
  // Lower-case <link> only: the HTML element, not Gaudi's <Link> component.
  { 'name': '<link> resource', 'pattern': new RegExp(String.raw`<link\b[^>]*\bhref\s*=\s*['"]${URL_START}`, 'g') },
  // Scripted requests.
  { 'name': 'fetch', 'pattern': new RegExp(String.raw`\bfetch\(\s*[\`'"]${URL_START}`, 'g') },
  { 'name': 'socket or stream', 'pattern': new RegExp(String.raw`new\s+(?:EventSource|WebSocket|Worker)\(\s*[\`'"](?:https?|wss?):\/\/`, 'g') },
  { 'name': 'dynamic import', 'pattern': new RegExp(String.raw`\bimport\(\s*[\`'"]${URL_START}`, 'g') },
  { 'name': 'Image()', 'pattern': new RegExp(String.raw`\.src\s*=\s*[\`'"]${URL_START}`, 'g') },
  // SVG <image href> / xlink:href to remote artwork.
  { 'name': 'svg image', 'pattern': new RegExp(String.raw`<(?:image|use|feImage)\b[^>]*\b(?:xlink:)?href\s*=\s*['"]${URL_START}`, 'gi') },
  // Image and media services Gaudi used to rely on; none may come back as built-in defaults.
  { 'name': 'image service', 'pattern': /\b(?:randomuser\.me|flagcdn\.com|api\.microlink\.io|img\.youtube\.com|i\.ytimg\.com|opengraph\.githubassets\.com|static\.npmjs\.com|images\.unsplash\.com|picsum\.photos|i\.pravatar\.cc|ui-avatars\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\b/g }
];

// Documented, deliberate exceptions. Each is code that never runs with a URL Gaudi chose itself.
const allowed = [
  {
    'file': 'src/components/mdx/Video/Video.js',
    'match': 'https://www.youtube.com/embed/',
    'reason': 'Rewrites an app-supplied YouTube watch link into its embed form; Gaudi supplies no video.'
  },
  {
    'file': '.storybook/stories/componentDocumentation.js',
    'match': "videoSrc='https://www.youtube.com/embed/qh3NGpYRG3I'",
    'reason': 'Copyable MDX/Video usage snippet shown as text in the docs; it is never rendered.'
  }
];

const listFiles = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);

  return statSync(path).isDirectory() ? listFiles(path) : [ relative(root, path).split('\\').join('/') ];
});

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  const rel = relative(root, path).split('\\').join('/');

  if (skipped.some((pattern) => pattern.test(`${rel}${statSync(path).isDirectory() ? '/' : ''}`))) return [];
  if (statSync(path).isDirectory()) return walk(path);

  return extensions.has(extname(name).toLowerCase()) ? [ rel ] : [];
});

// Comments describe behaviour; they are not loaded. Keep line numbers stable while removing them.
const blank = (text) => text.replace(/[^\n]/g, ' ');
const stripComments = (source, ext) => {
  let text = source.replace(/<!--[\s\S]*?-->/g, blank);

  if ([ '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mdx', '.css' ].includes(ext)) {
    text = text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^([ \t]*)\/\/.*$/gm, (line) => blank(line));
  }

  return text;
};

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

export const findExternalResources = (files = scanned.flatMap((dir) => walk(resolve(root, dir)))) => files.flatMap((file) => {
  const source = readFileSync(resolve(root, file), 'utf8');
  const text = stripComments(source, extname(file).toLowerCase());
  const lines = text.split('\n');

  return rules.flatMap((rule) => [ ...text.matchAll(rule.pattern) ].map((match) => {
    const line = lineOf(text, match.index);
    const snippet = lines[line - 1].trim().slice(0, 160);

    return { file, line, 'rule': rule.name, snippet };
  })).filter((hit) => !allowed.some((entry) => entry.file === hit.file && hit.snippet.includes(entry.match)));
});

test('the design system and its Storybook load nothing from the network', () => {
  const hits = findExternalResources();
  const report = hits.map((hit) => `${hit.file}:${hit.line} [${hit.rule}] ${hit.snippet}`).join('\n');

  assert.equal(hits.length, 0, `Absolute resource URLs found; use local assets under .storybook/public or app-supplied props:\n${report}`);
});

test('the guard catches resource URLs but not link targets', () => {
  const check = (snippet) => rules.some((rule) => new RegExp(rule.pattern.source, rule.pattern.flags).test(snippet));

  for (const resource of [
    "<img src='https://cdn.example.com/a.png' />",
    '<img src={`https://cdn.example.com/${id}.png`} />',
    "{ avatar: 'https://cdn.example.com/a.jpg' }",
    "assigneeAvatar: 'https://cdn.example.com/a.jpg'",
    "\"coverImage\": \"https://cdn.example.com/c.jpg\"",
    "<iframe src=\"https://player.example.com/embed/1\" />",
    "background-image: url('https://cdn.example.com/bg.png');",
    "@import url('https://fonts.example.com/css');",
    "<link rel=\"stylesheet\" href=\"https://cdn.example.com/s.css\">",
    "fetch('https://api.example.com/data')",
    "new WebSocket('wss://live.example.com')",
    "image.src = 'https://cdn.example.com/x.png';",
    "<image href=\"https://cdn.example.com/x.png\" />",
    "const face = `https://randomuser.me/api/portraits/women/1.jpg`;"
  ]) assert.ok(check(resource), resource);

  for (const link of [
    "<a href='https://github.com/ahmadassaf'>GitHub</a>",
    "<Link href='https://example.com/docs'>Docs</Link>",
    "{ url: 'https://example.com/post', title: 'Post' }",
    "{ href: 'https://example.com', label: 'Site' }",
    "<svg xmlns=\"http://www.w3.org/2000/svg\">",
    "const shareUrl = new URL('https://x.com/share');",
    "<Preview url='https://assaf.website' title='assaf.website' />",
    "<WebPreview defaultUrl='https://preview.example.dev/' srcDoc={html} />",
    "{ avatar: '/avatars/women/44.jpg' }",
    "<img src='/flags/gb.svg' />"
  ]) assert.ok(!check(link), link);
});

test('the local sample assets that replaced remote ones are present', () => {
  const avatars = listFiles(resolve(root, '.storybook/public/avatars'));
  const flags = listFiles(resolve(root, '.storybook/public/flags')).filter((file) => file.endsWith('.svg'));

  assert.ok(avatars.length >= 40, 'local portraits ship with Storybook');
  assert.ok(flags.length >= 16, 'local flags ship with Storybook');
  assert.match(readFileSync(resolve(root, '.storybook/public/avatars/README.md'), 'utf8'), /Random User/);
  assert.match(readFileSync(resolve(root, '.storybook/public/flags/README.md'), 'utf8'), /public domain/);

  // Every portrait and flag path used in examples resolves to a shipped file.
  const sources = scanned.flatMap((dir) => walk(resolve(root, dir))).filter((file) => /\.(jsx?|mjs)$/.test(file));
  const missing = new Set();

  for (const file of sources) {
    const text = readFileSync(resolve(root, file), 'utf8');

    for (const [ , path ] of text.matchAll(/['"`](\/avatars\/(?:men|women)\/\d+\.jpg)['"`]/g)) {
      if (!avatars.includes(`.storybook/public${path}`)) missing.add(`${file}: ${path}`);
    }
    for (const [ , gender, id ] of text.matchAll(/['"`]((?:wo)?men)\/(\d+)['"`]/g)) {
      if (!avatars.includes(`.storybook/public/avatars/${gender}/${id}.jpg`)) missing.add(`${file}: ${gender}/${id}`);
    }
  }

  assert.deepEqual([ ...missing ], []);
});
