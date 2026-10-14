#!/usr/bin/env node
// `pnpm generate` — derives every catalogue page of the site from the linked design system.
//
// Reads (never writes) the design-system checkout: its generated AI metadata (ai/*.json), the
// pattern coverage manifest, the owner fixtures, THEMING.md, README sections, llms.txt and the
// Storybook demo assets. Writes only inside this repository:
//   src/generated/catalogue.json        trimmed component metadata + section/sidebar model
//   src/generated/sources.json          copyable pattern sources (public imports), server-only
//   src/generated/patterns/<name>.jsx   the fixtures rewritten by the DS `publicSource` helper
//   src/generated/pattern-loaders.js    lazy import map used by the preview route
//   src/generated/component-loaders.js  lazy import map for the props playgrounds (playground.config.json)
//   content/docs/<section>/*.mdx        one page per component, block, chart, hook… (+ meta.json)
//   content/docs/theming/guide.md       THEMING.md
//   content/docs/ai/reference.md        the README "AI & agents" section
//   public/{avatars,static,flags}       demo assets referenced by the fixtures
//   src/generated/llms.txt              the DS llms.txt (its intro heads the site's /llms.txt route)
import { cpSync, existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const site = fileURLToPath(new URL('../', import.meta.url));
const linked = path.join(site, 'node_modules/@gaudi/design-system');
const ds = process.env.GAUDI_DS_DIR
  ? path.resolve(site, process.env.GAUDI_DS_DIR)
  : existsSync(linked) ? realpathSync(linked) : path.resolve(site, '..');

const read = (file) => readFileSync(path.join(ds, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const write = (file, content) => {
  const target = path.join(site, file);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
};
const GITHUB = 'https://github.com/g-udi/design-system';
const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const blob = (file) => `${GITHUB}/blob/main/${file.replace(/^\.?\//, '')}`;

// Brand hygiene: the site never names the organisation some DS notes mention. Drop any sentence
// (or list item) that does, instead of rewriting it.
const BLOCKED = new RegExp(String.fromCharCode(109, 97, 118, 57), 'i');
const sanitize = (text = '') => text
  .split('\n')
  .map((line) => (BLOCKED.test(line) ? line.split(/(?<=[.!?])\s+/).filter((sentence) => !BLOCKED.test(sentence)).join(' ') : line))
  .join('\n');

// ---------------------------------------------------------------------------------------------
// Inputs
const components = readJson('ai/components.json');
const blocks = readJson('ai/blocks.json');
const tokens = readJson('ai/tokens.json');
const setup = readJson('ai/setup.json');
const icons = readJson('ai/icons.json');
const coverage = readJson('src/docs/catalogue/coverage.json');
const catalogue = readJson('src/docs/catalogue/catalogue.json').entries;
const pkg = readJson('package.json');

// The Storybook `publicSource` rewrite, bundled from the DS docs helper into this repo's cache so
// copyable sources match Storybook's "Show code" and the registry exactly.
async function loadPublicSource() {
  const outfile = path.join(site, '.cache/pattern-story-helpers.mjs');
  await build({
    entryPoints: [path.join(ds, 'src/docs/components/PatternStoryHelpers.jsx')],
    bundle: true, format: 'esm', platform: 'node', outfile, packages: 'external',
    jsx: 'automatic', loader: { '.js': 'jsx' }, logLevel: 'silent'
  });
  return (await import(`${pathToFileURL(outfile)}?v=${Date.now()}`)).publicSource;
}

// ---------------------------------------------------------------------------------------------
// Sections (URL folders) and their sidebar groups
const SECTIONS = {
  core: { dir: 'components', title: 'Components' },
  blocks: { dir: 'blocks', title: 'Blocks' },
  chat: { dir: 'chat', title: 'Chat & Agents' },
  charts: { dir: 'charts', title: 'Charts' },
  hooks: { dir: 'hooks', title: 'Hooks' },
  animations: { dir: 'animations', title: 'Animations' },
  mdx: { dir: 'mdx', title: 'MDX' },
  post: { dir: 'layout', title: 'Post & Layout', group: 'Post' },
  layout: { dir: 'layout', title: 'Post & Layout', group: 'Layout' }
};
// A category the DS adds later gets its own section instead of breaking the build.
for (const { key, label } of components.categories) {
  SECTIONS[key] ??= { dir: key, title: label || key };
}

const kebab = (name) => name
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .replace(/[^A-Za-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase();

const groupOf = (component) => {
  if (SECTIONS[component.category].group) return SECTIONS[component.category].group;
  if (component.group) return component.group;
  const title = catalogue[component.storybook]?.title || component.title;
  const parts = title.split('/');
  if (parts.length > 2) return parts.slice(1, -1).join(' / ');
  return component.category === 'core' ? 'Basics' : null;
};

const used = new Set();
const pages = components.components.map((component) => {
  const section = SECTIONS[component.category];
  let slug = kebab(component.name);
  if (used.has(`${section.dir}/${slug}`)) slug = component.id;
  used.add(`${section.dir}/${slug}`);
  return { component, section, slug, url: `/docs/${section.dir}/${slug}`, group: groupOf(component) };
});
const pageById = new Map(pages.map((page) => [page.component.id, page]));

// Export name -> owning page, to derive related components from pattern imports.
const ownerOfExport = new Map();
for (const page of pages) {
  for (const name of page.component.import?.exports || []) {
    if (name !== 'default' && !ownerOfExport.has(name)) ownerOfExport.set(name, page.component.id);
  }
}

// ---------------------------------------------------------------------------------------------
// Patterns: rewrite every curated fixture to public imports and emit a module per pattern.
const publicSource = await loadPublicSource();
const blockMeta = new Map(blocks.blocks.map((block) => [block.name, block]));
const patterns = {};
const sources = {};
rmSync(path.join(site, 'src/generated/patterns'), { recursive: true, force: true });
for (const { owner, examples } of Object.values(coverage.categories)) {
  for (const example of examples) {
    const file = path.join(ds, example.file);
    if (!existsSync(file)) { console.warn(`! missing fixture ${example.file}`); continue; }
    const source = publicSource(readFileSync(file, 'utf8'), pathToFileURL(file));
    const meta = blockMeta.get(example.name);
    patterns[example.name] = {
      name: example.name,
      title: example.title,
      description: example.description && example.description !== example.title ? sanitize(example.description) : null,
      owner,
      block: owner.startsWith('blocks/'),
      storyId: example.storyId,
      sourceFile: example.file,
      uses: meta?.uses || [],
      dependencies: meta?.dependencies || ['@gaudi/design-system'],
      assets: meta?.assets || []
    };
    sources[example.name] = source;
    // Hoist the client directive (some fixtures place an import above it).
    // Storybook fixtures also run below nested /preview/<name>/ routes here. Resolve the
    // bundled demo folders from the site's public root, including subpath deployments.
    const previewSource = source.replace(/(['"`])(?:\.\/|\/)?(avatars|static|flags)\//g,
      (_, quote, folder) => `${quote}${assetBasePath}/${folder}/`);
    const body = `'use client';\n${previewSource.replace(/^\s*['"]use client['"];?\s*$/gm, '')}`;
    write(`src/generated/patterns/${example.name}.jsx`, body);
  }
}
const patternNames = Object.keys(patterns).sort();
write('src/generated/pattern-loaders.js', [
  '// Generated by scripts/generate.mjs — lazy loaders for every pattern preview.',
  'export const patternLoaders = {',
  ...patternNames.map((name) => `  ${JSON.stringify(name)}: () => import('./patterns/${name}.jsx'),`),
  '};',
  ''
].join('\n'));
write('src/generated/pattern-loaders.d.ts', 'export declare const patternLoaders: Record<string, () => Promise<unknown>>;\n');

// Props playgrounds: one lazy loader per owner listed in the site's playground config, resolving to
// the owner's main component (named export when the package has one, else the default export).
const playgroundConfig = JSON.parse(readFileSync(path.join(site, 'src/components/docs/playground.config.json'), 'utf8')).components;
const playgroundIds = Object.keys(playgroundConfig).filter((id) => {
  const ok = pageById.has(id);
  if (!ok) console.warn(`! playground config names unknown owner ${id}`);
  return ok;
}).sort();
write('src/generated/component-loaders.js', [
  '// Generated by scripts/generate.mjs — lazy loaders for the live props playgrounds.',
  'export const componentLoaders = {',
  ...playgroundIds.map((id) => {
    const { import: spec, name } = pageById.get(id).component;
    const from = spec.leaf || spec.path;
    const named = spec.mainExport || name;
    const pick = spec.exports.includes(named) ? `mod[${JSON.stringify(named)}]` : 'mod.default';
    return `  ${JSON.stringify(id)}: () => import(${JSON.stringify(from)}).then((mod) => ${pick}),`;
  }),
  '};',
  ''
].join('\n'));
write('src/generated/component-loaders.d.ts', 'export declare const componentLoaders: Record<string, () => Promise<unknown>>;\n');

// ---------------------------------------------------------------------------------------------
// Catalogue model for the React components (trimmed: no READMEs).
const patternsByOwner = new Map();
for (const page of pages) {
  const names = (page.component.examples?.patterns || []).map((entry) => entry.name).filter((name) => patterns[name]);
  patternsByOwner.set(page.component.id, names);
}

const relatedOf = (page) => {
  const ids = new Set((page.component.related || []).map((entry) => (typeof entry === 'string' ? entry : entry.id)).filter((id) => pageById.has(id)));
  const counts = new Map();
  for (const name of patternsByOwner.get(page.component.id)) {
    for (const used of patterns[name].uses) {
      const owner = ownerOfExport.get(used);
      if (owner && owner !== page.component.id) counts.set(owner, (counts.get(owner) || 0) + 1);
    }
  }
  [...counts.entries()].sort((a, b) => b[1] - a[1]).forEach(([id]) => ids.add(id));
  if (ids.size < 3) {
    pages.filter((other) => other !== page && other.component.category === page.component.category && other.group === page.group)
      .forEach((other) => ids.add(other.component.id));
  }
  return [...ids].slice(0, 6);
};

const trimmed = pages.map((page) => {
  const c = page.component;
  return {
    id: c.id,
    name: c.name,
    kind: c.kind,
    category: c.category,
    section: page.section.dir,
    group: page.group,
    url: page.url,
    owner: c.owner,
    import: c.import,
    description: sanitize(c.description || c.summary || ''),
    summary: c.summary ? sanitize(c.summary) : null,
    // part/subcomponent/passthrough/api flag rows that are not plain props (see the DS scripts/ai/build.mjs).
    props: (c.props || []).map(({ name, names, part, subcomponent, passthrough, api, type, default: defaultValue, required, description }) => ({
      name, names: names || [name], ...(part ? { part } : {}), ...(subcomponent ? { subcomponent: true } : {}), ...(passthrough ? { passthrough: true } : {}), ...(api ? { api: true } : {}),
      type, default: defaultValue ?? null, required: !!required, description: sanitize(description || '')
    })),
    propsTitle: c.propsTitle || null,
    returns: c.returns || null,
    variants: c.variants || {},
    accessibility: c.accessibility ? sanitize(c.accessibility) : null,
    notes: (c.notes || []).map(sanitize).filter(Boolean),
    dos: c.dos || [],
    donts: c.donts || [],
    usage: c.usage ? sanitize(c.usage) : null,
    stories: c.examples?.stories || [],
    patterns: patternsByOwner.get(c.id),
    storybook: c.storybook,
    source: c.source,
    docs: c.docs,
    related: relatedOf(page)
  };
});

const categories = components.categories.map((category) => ({ ...category, section: SECTIONS[category.key].dir, sectionTitle: SECTIONS[category.key].title }));
write('src/generated/catalogue.json', `${JSON.stringify({
  package: pkg.name,
  version: pkg.version,
  generatedAt: new Date().toISOString().slice(0, 10),
  categories,
  components: trimmed,
  patterns,
  presets: setup.theming?.themes?.presets || [],
  install: setup.install,
  icons: icons.names,
  styles: setup.styles,
  tokens: Object.fromEntries(Object.entries(tokens).filter(([key]) => !['package', 'version', 'generatedBy'].includes(key)))
}, null, 1)}\n`);
write('src/generated/sources.json', `${JSON.stringify(sources)}\n`);

// ---------------------------------------------------------------------------------------------
// MDX pages
const escapeMdx = (text = '') => sanitize(text)
  .split(/(`[^`]*`)/g)
  .map((part, index) => (index % 2 ? part : part
    .replace(/\\/g, '\\\\')
    .replace(/[{}]/g, (char) => `\\${char}`)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')))
  .join('');
const yaml = (value) => JSON.stringify(value);
// JSX expression attributes accept any string; MDX string attributes cannot escape quotes.
const attr = (value) => `{${JSON.stringify(value)}}`;

for (const dir of new Set(Object.values(SECTIONS).map((section) => section.dir))) {
  rmSync(path.join(site, 'content/docs', dir), { recursive: true, force: true });
}

for (const page of pages) {
  const c = trimmed.find((entry) => entry.id === page.component.id);
  const block = c.category === 'blocks';
  // The lead sentence becomes the page subtitle; the rest of the description follows it.
  const sentences = c.description.split(/(?<=\.)\s+/);
  const lead = c.summary || sentences[0];
  const rest = c.summary ? c.description : sentences.slice(1).join(' ');
  const lines = [
    '---',
    `title: ${yaml(c.name)}`,
    `description: ${yaml(lead)}`,
    `component: ${yaml(c.id)}`,
    ...(block ? ['full: true'] : []),
    '---',
    '',
    `<ComponentHeader id=${attr(c.id)} />`,
    '',
    ...(rest && rest !== lead ? [escapeMdx(rest), ''] : []),
    `<ComponentLinks id=${attr(c.id)} />`,
    ''
  ];
  if (c.kind !== 'hook') lines.push('## Installation', '', `<Install id=${attr(c.id)} />`, '');
  if (c.usage) lines.push('## Usage', '', `<Usage id=${attr(c.id)} />`, '');
  if (playgroundIds.includes(c.id)) lines.push('## Playground', '', `<Playground id=${attr(c.id)} />`, '');
  const stories = c.stories.filter((entry) => !entry.id.endsWith('--docs'));
  if (c.patterns.length || stories.length) lines.push('## Examples', '');
  if (c.patterns.length) {
    for (const name of c.patterns) {
      const pattern = patterns[name];
      lines.push(`### ${escapeMdx(pattern.title)}`, '');
      if (pattern.description) lines.push(escapeMdx(pattern.description), '');
      lines.push(`<Example name=${attr(name)} />`, '');
    }
  } else {
    // Owners without a copy-in pattern render each Storybook story in place.
    for (const story of stories) {
      lines.push(`### ${escapeMdx(story.name)}`, '', `<StoryExample id=${attr(story.id)} title=${attr(story.name)} />`, '');
    }
  }
  if (c.props.length || c.returns?.length) {
    lines.push('## API', '', `<PropsTable id=${attr(c.id)} />`, '');
  }
  if (c.accessibility) lines.push('## Accessibility', '', escapeMdx(c.accessibility), '');
  if (c.notes.length) lines.push('## Notes', '', ...c.notes.map((note) => `- ${escapeMdx(note)}`), '');
  if (c.related.length) lines.push('## Related', '', `<Related id=${attr(c.id)} />`, '');
  write(`content/docs/${page.section.dir}/${page.slug}.mdx`, `${lines.join('\n')}\n`);
}

// Section index pages + sidebar order (meta.json, with group separators).
for (const [dir, sectionPages] of Object.entries(Object.groupBy(pages, (page) => page.section.dir))) {
  const title = sectionPages[0].section.title;
  const keys = [...new Set(sectionPages.map((page) => page.component.category))];
  const groups = Object.groupBy(sectionPages, (page) => page.group || '');
  const order = Object.keys(groups).sort((a, b) => (a === 'Basics' ? -1 : b === 'Basics' ? 1 : 0));
  const entries = []; // index.mdx becomes the folder's own page (shown as "Overview")
  for (const group of order) {
    if (group) entries.push(`---${group}---`);
    entries.push(...groups[group].sort((a, b) => a.component.name.localeCompare(b.component.name)).map((page) => page.slug));
  }
  write(`content/docs/${dir}/meta.json`, `${JSON.stringify({ title, pages: entries }, null, 2)}\n`);
  const description = keys.map((key) => components.categories.find((category) => category.key === key)?.description).filter(Boolean).join(' ');
  write(`content/docs/${dir}/index.mdx`, [
    '---',
    `title: ${yaml(title)}`,
    `description: ${yaml(sanitize(description))}`,
    '---',
    '',
    `<SectionIndex section=${attr(dir)} />`,
    ''
  ].join('\n'));
}

// ---------------------------------------------------------------------------------------------
// Guides rendered from DS markdown (links rewritten to the repository on GitHub).
const rewriteLinks = (markdown, base) => markdown.replace(/\]\((?!https?:|#|mailto:)([^)]+)\)/g, (_, target) => {
  const resolved = path.posix.normalize(path.posix.join(base, target));
  return `](${blob(resolved)})`;
});

const theming = rewriteLinks(sanitize(read('src/tokens/THEMING.md')), 'src/tokens').replace(/^# .*\n+/, '');
write('content/docs/theming/guide.md', [
  '---',
  'title: Theming guide',
  'description: "The theme contract, runtime API, Next.js setup, fonts, import/export and contrast, rendered from the design system THEMING.md."',
  '---',
  '',
  `> Rendered from [src/tokens/THEMING.md](${blob('src/tokens/THEMING.md')}) at build time.`,
  '',
  theming
].join('\n'));

const readme = sanitize(read('README.md'));
const aiStart = readme.indexOf('## AI & agents');
const aiEnd = readme.indexOf('\n## ', aiStart + 5);
const aiSection = rewriteLinks(readme.slice(aiStart, aiEnd), '.')
  .replace(/^## AI & agents\n+/, '')
  .replace(/^### /gm, '## ')
  .replace(/\(#credits--acknowledgements\)/g, `(${GITHUB}#credits--acknowledgements)`)
  .replace(/\(#third-party-notices\)/g, `(${GITHUB}#third-party-notices)`);
write('content/docs/ai/reference.md', [
  '---',
  'title: AI reference',
  'description: "llms.txt, the agent skill installer, the MCP server and the copy-in registry, rendered from the design system README."',
  '---',
  '',
  `> Rendered from the [README "AI & agents" section](${GITHUB}#ai--agents) at build time.`,
  '',
  aiSection
].join('\n'));

// ---------------------------------------------------------------------------------------------
// Static assets used by the fixtures + the DS llms.txt (read by src/app/llms.txt/route.ts)
for (const folder of ['avatars', 'static', 'flags']) {
  const from = path.join(ds, '.storybook/public', folder);
  if (existsSync(from)) cpSync(from, path.join(site, 'public', folder), { recursive: true });
}
// The shadcn registry items (`pnpm registry:build` in the design system) are served at /r/<name>.json.
const registry = path.join(ds, 'public/r');
if (existsSync(registry)) cpSync(registry, path.join(site, 'public/r'), { recursive: true });
write('src/generated/llms.txt', sanitize(read('llms.txt')));

// ---------------------------------------------------------------------------------------------
// Guard: nothing generated may name the blocked brand.
const leaks = [];
for (const [name, source] of Object.entries(sources)) if (BLOCKED.test(source)) leaks.push(`pattern ${name}`);
if (leaks.length) throw new Error(`Generated content mentions a blocked name: ${leaks.join(', ')}`);

const counts = Object.fromEntries(Object.entries(Object.groupBy(pages, (page) => page.section.dir)).map(([dir, list]) => [dir, list.length]));
console.log(`Generated ${pages.length} component pages ${JSON.stringify(counts)}, ${patternNames.length} pattern previews (${Object.values(patterns).filter((p) => p.block).length} blocks) from ${path.relative(site, ds) || ds}.`);
