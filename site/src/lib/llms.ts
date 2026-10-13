// Markdown versions of every docs page, for language models: `/docs/<slug>.md`, `Accept:
// text/markdown`, `/llms.txt`, `/llms-full.txt`, the page actions and Ask AI all read from here.
// Generated component pages are rendered from the same catalogue the page components use;
// hand-written MDX is read from content/ and its JSX turned back into plain Markdown.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Folder, Node, Root } from 'fumadocs-core/page-tree';
import sources from '@/generated/sources.json';
import { catalogue, componentsInSection, getComponent, getPattern, type ComponentEntry } from '@/lib/catalogue';
import { designSystemRoot, lastCommitDate, siteRoot } from '@/lib/git-dates';
import { source, type DocsPage } from '@/lib/source';
import { siteConfig, storybookStoryUrl } from '../../site.config';

/** Public origin for absolute links in llms.txt and chat prompts; root-relative when unset. */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const absoluteUrl = (pathname: string) => `${siteUrl}${basePath}${pathname}`;
/**
 * Where a page's Markdown lives. Servers answer `/docs/<slug>.md` (and `/docs.md`) through
 * src/proxy.ts; a static export has no proxy, so it links the prerendered `/md/<slug>.md` files.
 */
export const markdownPath = (url: string) => {
  if (process.env.STATIC_EXPORT === '1') return `/md/${url.replace(/^\/docs\/?/, '').replace(/\/$/, '') || 'index'}.md`;
  return `${url.replace(/\/$/, '')}.md`;
};
/** Route params for /md/[...slug]: `['components', 'button.md']`, `['index.md']` for the overview. */
export const markdownSlug = (page: DocsPage) => (page.slugs.length ? [...page.slugs.slice(0, -1), `${page.slugs.at(-1)}.md`] : ['index.md']);

type Detail = 'full' | 'summary';
const extras = catalogue as unknown as { icons: string[] };
const entryDetails = (entry: ComponentEntry) => entry as ComponentEntry & { dos?: string[]; donts?: string[] };
const sourceOf = (name: string) => (sources as Record<string, string>)[name] || '';
const registryInstall = (name: string) => `npx shadcn@latest add ${siteConfig.registryUrl.replace(/\/$/, '')}/r/${name}.json`;
const cell = (value: unknown) => String(value ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim() || '—';
const code = (value: string) => `\`${value.replace(/`/g, 'ˋ')}\``;
const fence = (language: string, body: string) => {
  const ticks = body.includes('```') ? '````' : '```';
  return `${ticks}${language}\n${body.replace(/\n+$/, '')}\n${ticks}`;
};
const table = (head: string[], rows: unknown[][]) => [
  `| ${head.join(' | ')} |`,
  `| ${head.map(() => '---').join(' | ')} |`,
  ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`)
].join('\n');

// ---------------------------------------------------------------------------------------------
// Where each page comes from

/** Section folders written by scripts/generate.mjs (one per catalogue category). */
const generatedSections = new Set(catalogue.categories.map((category) => category.section));
/** Guides rendered from design-system Markdown: page path -> design-system file. */
const renderedGuides: Record<string, string> = { 'theming/guide.md': 'src/tokens/THEMING.md', 'ai/reference.md': 'README.md' };

export interface PageOrigin {
  /** Hand-written in this repository's content/ (the only pages with "Edit on GitHub"). */
  handWritten: boolean;
  sourceUrl: string;
  editUrl: string | null;
  /** ISO date of the last commit touching the page's source, or null without history. */
  lastModified: string | null;
}

export function pageOrigin(page: DocsPage): PageOrigin {
  const id = page.data.component;
  const entry = id ? getComponent(id) : undefined;
  if (entry) {
    return { handWritten: false, sourceUrl: `${siteConfig.github}/tree/main/${entry.source.replace(/^\.?\//, '')}`, editUrl: null, lastModified: lastCommitDate(designSystemRoot, entry.source.replace(/^\.?\//, '')) };
  }
  const guide = renderedGuides[page.path];
  if (guide) return { handWritten: false, sourceUrl: `${siteConfig.github}/blob/main/${guide}`, editUrl: null, lastModified: lastCommitDate(designSystemRoot, guide) };
  if (generatedSections.has(page.path.split('/')[0])) {
    return { handWritten: false, sourceUrl: `${siteConfig.github}/blob/main/ai/components.json`, editUrl: null, lastModified: lastCommitDate(designSystemRoot, 'ai/components.json') };
  }
  const file = `content/docs/${page.path}`;
  return { handWritten: true, sourceUrl: `${siteConfig.github}/blob/main/site/${file}`, editUrl: `${siteConfig.github}/edit/main/site/${file}`, lastModified: lastCommitDate(siteRoot, file) };
}

// ---------------------------------------------------------------------------------------------
// Generated component pages (mirrors scripts/generate.mjs + src/components/docs/catalogue-blocks)

const importLine = (entry: ComponentEntry) => {
  const from = entry.import.leaf || entry.import.path;
  const name = entry.import.mainExport || entry.name;
  if (entry.import.exports.includes(name)) return `import { ${name} } from '${from}';`;
  if (entry.import.exports.includes('default')) return `import ${name.replace(/[^A-Za-z0-9_$]/g, '')} from '${from}';`;
  return `import { ${entry.import.exports[0]} } from '${from}';`;
};

const componentLink = (entry: ComponentEntry) => `[${entry.name}](${absoluteUrl(entry.url)})`;

function componentMarkdown(entry: ComponentEntry, detail: Detail) {
  const { dos = [], donts = [] } = entryDetails(entry);
  const category = catalogue.categories.find((item) => item.key === entry.category);
  const sentences = entry.description.split(/(?<=\.)\s+/);
  const rest = entry.summary ? entry.description : sentences.slice(1).join(' ');
  const out: string[] = [];
  if (rest) out.push(rest);
  out.push([
    `- Category: ${[category?.label, entry.group && entry.group !== category?.label ? entry.group : null].filter(Boolean).join(' · ')}`,
    `- Import: ${code(entry.import.leaf || entry.import.path)}${entry.import.category ? ` (also ${code(entry.import.category)})` : ''}`,
    `- Source: ${siteConfig.github}/tree/main/${entry.source.replace(/^\.?\//, '')}`,
    ...(entry.storybook ? [`- Storybook: ${storybookStoryUrl(entry.storybook)}`] : [])
  ].join('\n'));

  if (entry.kind !== 'hook') {
    const peers = entry.category === 'charts' ? ' recharts' : entry.id === 'core-flow' ? ' @xyflow/react' : '';
    out.push('## Installation', fence('bash', `pnpm add ${siteConfig.installSpec}${peers}`),
      `Import from ${code(siteConfig.packageName)}. Load ${code('@gaudi/design-system/global.css')} once and add ${code("transpilePackages: ['@gaudi/design-system']")} in Next.js.`,
      fence('jsx', importLine(entry)));
    if (entry.patterns[0]) out.push(`Copy an example into your project with the shadcn CLI: ${code(registryInstall(entry.patterns[0]))}.`);
  }
  if (entry.usage) out.push('## Usage', fence('jsx', entry.usage));
  if (dos.length || donts.length) {
    out.push('## Usage rules');
    if (dos.length) out.push('Do:', dos.map((rule) => `- ${rule}`).join('\n'));
    if (donts.length) out.push("Don't:", donts.map((rule) => `- ${rule}`).join('\n'));
  }

  out.push('## Examples');
  if (entry.patterns.length) {
    for (const name of entry.patterns) {
      const pattern = getPattern(name);
      if (!pattern) continue;
      out.push(`### ${pattern.title}`);
      if (pattern.description) out.push(pattern.description);
      const body = detail === 'full' ? sourceOf(name) : '';
      out.push(body ? `${fence('jsx', body)}\n\nRegistry: ${code(registryInstall(name))}` : `Registry: ${code(registryInstall(name))}`);
    }
  } else {
    out.push('Examples (rendered from Storybook):', entry.stories.map((story) => `- [${story.name}](${storybookStoryUrl(story.id)})`).join('\n'));
  }

  if (entry.props.length || entry.returns?.length) {
    out.push('## API');
    if (entry.props.length) {
      if (entry.propsTitle) out.push(`### ${entry.propsTitle}`);
      out.push(table([entry.kind === 'hook' ? 'Option' : 'Prop', 'Type', 'Default', 'Required', 'Description'], entry.props.map((row) => [
        code(row.name) + (row.subcomponent ? ' (sub-component)' : row.passthrough ? ' (pass-through)' : row.api ? ' (helper)' : ''), code(row.type), row.default ? code(row.default) : '—', row.required ? 'yes' : 'no', row.description
      ])));
    }
    if (entry.returns?.length) {
      out.push('### Returns', table(['Name', 'Type', 'Description'], entry.returns.map((row) => [code(row.name), code(row.type), row.description])));
    }
  }
  const variants = Object.entries(entry.variants || {});
  if (variants.length) out.push('### Variants', variants.map(([key, values]) => `- ${code(key)}: ${values.map(code).join(', ')}`).join('\n'));
  if (entry.accessibility) out.push('## Accessibility', entry.accessibility);
  if (entry.notes.length) out.push('## Notes', entry.notes.map((note) => `- ${note}`).join('\n'));
  const related = entry.related.map(getComponent).filter((item): item is ComponentEntry => Boolean(item));
  if (related.length) out.push('## Related', related.map((item) => `- ${componentLink(item)}: ${item.summary || item.description.split(/(?<=\.)\s+/)[0]}`).join('\n'));
  return out.join('\n\n');
}

function sectionIndexMarkdown(section: string) {
  const entries = componentsInSection(section);
  const groups = Object.entries(Object.groupBy(entries, (entry) => entry.group || 'All'));
  const examples = entries.reduce((sum, entry) => sum + entry.patterns.length, 0);
  const out = [`${entries.length} pages · ${examples} live examples, generated from the design system metadata.`];
  for (const [group, list] of groups) {
    if (groups.length > 1) out.push(`## ${group}`);
    out.push((list || []).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => `- ${componentLink(entry)}: ${entry.summary || entry.description}`).join('\n'));
  }
  return out.join('\n\n');
}

// ---------------------------------------------------------------------------------------------
// Hand-written MDX: JSX back to Markdown (code fences are left untouched)

const attrs = (raw: string) => Object.fromEntries([...raw.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)'|\{['"`]([^'"`]*)['"`]\})/g)].map((match) => [match[1], match[2] ?? match[3] ?? match[4]]));

const DATA_BLOCKS: Record<string, () => string> = {
  ColorTokens: () => `${catalogue.tokens.colors.usage}\n\nSemantic colour utilities (\`bg-*\`, \`text-*\`, \`border-*\`, CSS variables \`--ds-color-*\`): ${catalogue.tokens.colors.semanticUtilities.map(code).join(', ')}.`,
  RadiusAndDensity: () => {
    const { spacing, radius } = catalogue.tokens;
    return [`Density: ${spacing.usage}`, table(['Scale', `${code(spacing.variable)}`], Object.entries(spacing.scales).map(([name, value]) => [name, value])), `Radius: ${radius.usage} Default ${code(radius.default)} via ${code(radius.variable)}.`].join('\n\n');
  },
  MotionTokens: () => {
    const { duration, ease } = catalogue.tokens.motion;
    return table(['Token', 'Value'], [...Object.entries(duration).map(([name, value]) => [`duration ${name}`, code(value)]), ...Object.entries(ease).map(([name, value]) => [`ease ${name}`, code(value)])]);
  },
  TypeScale: () => {
    const { fontFamily, lineHeight } = catalogue.tokens.typography;
    return [table(['Family', 'Stack'], Object.entries(fontFamily).map(([name, stack]) => [name, code(stack.join(', '))])), table(['Line height', 'Value'], Object.entries(lineHeight).map(([name, value]) => [name, value]))].join('\n\n');
  },
  IconGallery: () => `${extras.icons.length} registry icon names for \`<Icon name='…' />\`: ${extras.icons.map(code).join(', ')}.`,
  PresetGallery: () => `Theme presets: ${catalogue.presets.map(code).join(', ')}.`
};

function jsxToMarkdown(text: string) {
  return text
    .replace(/^(?:import|export)\s.+$/gm, '')
    .replace(/^[ \t]*<Cards>[ \t]*\n/gm, '')
    .replace(/^[ \t]*<\/Cards>[ \t]*$/gm, '')
    .replace(/^[ \t]*<Card\s+([^>]*)>([\s\S]*?)<\/Card>/gm, (_, raw: string, body: string) => {
      const { title, href } = attrs(raw);
      return `- [${title}](${href?.startsWith('/') ? absoluteUrl(href) : href})${body.trim() ? `: ${body.trim()}` : ''}`;
    })
    .replace(/^[ \t]*<StorybookCard\s+([^>]*)>([\s\S]*?)<\/StorybookCard>/gm, (_, raw: string, body: string) => {
      const { title, story } = attrs(raw);
      return `- [${title}](${storybookStoryUrl(story)})${body.trim() ? `: ${body.trim()}` : ''}`;
    })
    .replace(/<Callout(?:\s+([^>]*))?>([\s\S]*?)<\/Callout>/g, (_, raw = '', body: string) => {
      const type = attrs(raw).type || 'info';
      const label = type === 'warning' || type === 'warn' ? 'Warning' : type === 'error' ? 'Important' : 'Note';
      return body.trim().split('\n').map((line, index) => `> ${index ? '' : `**${label}:** `}${line.trim()}`).join('\n');
    })
    .replace(/<([A-Z]\w*)\b([^>]*?)\/>/g, (match, name: string, raw: string) => {
      if (DATA_BLOCKS[name]) return DATA_BLOCKS[name]();
      if (name === 'SectionIndex') return sectionIndexMarkdown(attrs(raw).section);
      return '';
    })
    .replace(/\]\((\/(?!\/)[^)\s]*)\)/g, (_, href: string) => `](${absoluteUrl(href)})`)
    .replace(/\n{3,}/g, '\n\n');
}

function mdxToMarkdown(raw: string) {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  // Odd parts are fenced code blocks; only prose is converted.
  return body.split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)\s*$)/m).map((part, index) => (index % 2 ? part : jsxToMarkdown(part))).join('').trim();
}

// ---------------------------------------------------------------------------------------------
// Public API

const cache = new Map<string, string>();

/** The page as Markdown: `# Title`, the description as a quote, then the body. */
export function pageMarkdown(page: DocsPage, detail: Detail = 'full') {
  const key = `${detail}:${page.url}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const entry = page.data.component ? getComponent(page.data.component) : undefined;
  let body: string;
  if (entry) body = componentMarkdown(entry, detail);
  else {
    let raw = '';
    try { raw = readFileSync(path.join(siteRoot, 'content/docs', page.path), 'utf8'); } catch { /* missing file: header only */ }
    body = mdxToMarkdown(raw);
  }
  const markdown = [`# ${page.data.title}`, page.data.description ? `> ${page.data.description}` : '', body].filter(Boolean).join('\n\n') + '\n';
  cache.set(key, markdown);
  return markdown;
}

/** A component page's example sources as Markdown, whole examples only, up to `maxChars`. */
export function exampleMarkdown(page: DocsPage, maxChars: number) {
  const entry = page.data.component ? getComponent(page.data.component) : undefined;
  const out: string[] = [];
  let used = 0;
  for (const name of entry?.patterns || []) {
    const pattern = getPattern(name);
    const block = pattern ? `### Example: ${pattern.title}\n\n${fence('jsx', sourceOf(name))}` : '';
    if (!block || used + block.length > maxChars) continue;
    out.push(block);
    used += block.length;
  }
  return out.join('\n\n');
}

/** Pages in sidebar order (folder overview first, then its children). */
export function orderedPages(tree: Root = source.pageTree): DocsPage[] {
  const urls: string[] = [];
  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.type === 'page') urls.push(node.url);
      else if (node.type === 'folder') {
        if (node.index) urls.push(node.index.url);
        walk(node.children);
      }
    }
  };
  walk(tree.children);
  const byUrl = new Map(source.getPages().map((page) => [page.url, page]));
  const ordered = urls.map((url) => byUrl.get(url)).filter((page): page is DocsPage => Boolean(page));
  // Anything not in the tree (hidden pages) still gets a Markdown version at the end.
  const seen = new Set(ordered);
  return [...ordered, ...source.getPages().filter((page) => !seen.has(page))];
}

/** Resolve a page from Markdown route params (`['components', 'button.md']`, `['index.md']`). */
export function pageFromMarkdownSlug(slug: string[] | undefined) {
  const parts = (slug || []).map((part) => decodeURIComponent(part));
  if (!parts.at(-1)?.endsWith('.md')) return undefined;
  parts[parts.length - 1] = parts[parts.length - 1].slice(0, -'.md'.length);
  return source.getPage(parts.length === 1 && parts[0] === 'index' ? [] : parts);
}

/** The design-system llms.txt intro (title, summary, install), copied by scripts/generate.mjs. */
function llmsIntro() {
  try {
    const text = readFileSync(path.join(siteRoot, 'src/generated/llms.txt'), 'utf8');
    const cut = text.search(/\n## /);
    const head = cut === -1 ? text : text.slice(0, cut);
    // Drop the paragraph that says its links are repository-relative; ours are site URLs.
    return head.split(/\n{2,}/).filter((paragraph) => !/relative to the repository/i.test(paragraph)).join('\n\n').trim();
  } catch {
    return `# ${siteConfig.product} (${siteConfig.packageName})\n\n> ${siteConfig.description}`;
  }
}

const label = (name: unknown) => (typeof name === 'string' ? name : '');

/** `/llms.txt`: the package summary and an index of every page's Markdown URL. */
export function llmsTxt() {
  const byUrl = new Map(source.getPages().map((page) => [page.url, page]));
  const line = (url: string) => {
    const page = byUrl.get(url);
    return page ? `- [${page.data.title}](${absoluteUrl(markdownPath(page.url))})${page.data.description ? `: ${page.data.description}` : ''}` : null;
  };
  const sections: string[] = [];
  const loose: string[] = [];
  const collect = (folder: Folder) => {
    const lines: string[] = [];
    if (folder.index) lines.push(line(folder.index.url) || '');
    const walk = (nodes: Node[]) => {
      for (const node of nodes) {
        if (node.type === 'page') lines.push(line(node.url) || '');
        else if (node.type === 'folder') { if (node.index) lines.push(line(node.index.url) || ''); walk(node.children); }
      }
    };
    walk(folder.children);
    return lines.filter(Boolean);
  };
  for (const node of source.pageTree.children) {
    if (node.type === 'page') loose.push(line(node.url) || '');
    else if (node.type === 'folder') sections.push(`## ${label(node.name)}\n\n${collect(node).join('\n')}`);
  }
  return [
    llmsIntro(),
    `Every page of this site is available as Markdown at the links below${process.env.STATIC_EXPORT === '1' ? '' : ' (append `.md` to any docs URL, or request one with `Accept: text/markdown`)'}. [llms-full.txt](${absoluteUrl('/llms-full.txt')}) concatenates every page.`,
    `## Docs\n\n${loose.filter(Boolean).join('\n')}`,
    ...sections
  ].join('\n\n') + '\n';
}

/** `/llms-full.txt`: every page in sidebar order (example sources stay on the per-page Markdown). */
export function llmsFullTxt() {
  return orderedPages().map((page) => `${pageMarkdown(page, 'summary').trim()}\n\nSource: ${absoluteUrl(page.url)} (Markdown with example code: ${absoluteUrl(markdownPath(page.url))})`).join('\n\n---\n\n') + '\n';
}

export const markdownHeaders = { 'Content-Type': 'text/markdown; charset=utf-8', 'Vary': 'Accept' };
