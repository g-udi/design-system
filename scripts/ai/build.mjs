// `pnpm ai:build` — generates the agent-facing metadata from the repository's sources of truth:
//   ai/components.json, ai/blocks.json, ai/tokens.json, ai/icons.json, ai/setup.json
//   docs/llm/<id>.md, llms.txt, llms-full.txt
// Output is deterministic (sorted, no timestamps). `--check` fails when any file is stale.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { blockMarkdown, componentMarkdown } from '../../cli/markdown.mjs';
import { derivePatterns } from './patterns.mjs';
import { exists, json, loadEntryExports, loadHookCatalogue, loadIconNames, loadObjectKeys, loadOwnerDocs, packageJson, readJson, readText, root } from './sources.mjs';

const check = process.argv.includes('--check');
const manifest = packageJson();
const PKG = manifest.name;

export const categories = [
  ['core', 'Core', 'Controls, inputs, overlays, data display, feedback and navigation primitives.'],
  ['blocks', 'Blocks', 'Composed application blocks: app shells, auth and onboarding screens, dashboards, forms, scheduling, stat cards and wizards.'],
  ['chat', 'Chat', 'Chat and agent interface owners (every export is Chat-prefixed).'],
  ['charts', 'Charts', 'Recharts-based charts framed by ChartFrame. Not in the root entry; install the optional `recharts` peer.'],
  ['hooks', 'Hooks', 'Shared React hooks for accessibility, data, environment, interaction, layout and state.'],
  ['animations', 'Animations', 'Text and background effects with scoped rendering, reduced motion and visibility-aware playback.'],
  ['mdx', 'MDX', 'Article primitives for MDX content and the compiled MDX runtime.'],
  ['post', 'Post', 'Blog post page parts: header, navigation, series box and table of contents.'],
  ['layout', 'Layout', 'Site layout: containers, wrappers, footer, search and newsletter.']
];
const categoryOrder = categories.map(([key]) => key);

const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const empty = (value) => value == null || ['—', '-', ''].includes(String(value).trim());
// Names split on '/' (and ',' for parameter lists), except inside call signatures such as `toast(message, options)`.
const splitNames = (name) => (/\([^)]+\)|[{}]/.test(name) ? [name] : name.split(/\s*[/,]\s*/)).map((part) => part.trim()).filter(Boolean);

const identifier = /^(?:\.\.\.)?[A-Za-z_$][\w$-]*(?:\.[\w$]+)*(?:\(\))?$/;
const signature = /^[\w$.]+\(.*\)$/;
const componentName = /^[A-Z][\w$]*$/;

function prop([name, type, defaultValue, description]) {
  const names = splitNames(name);
  const parts = names.map((entry) => entry.match(/^([A-Z][\w]*)\.(.+)$/));
  // `toast(message, options)`: a helper the owner exports, documented alongside its props.
  const api = names.length === 1 && signature.test(names[0]);
  // "Native input props / ref", "className / style / ref / DOM props": pass-through rows, not named props.
  const passthrough = !api && names.some((entry) => !identifier.test(entry));
  // "AvatarGroup", "Field / RadioGroup / Switch": a sub-component, or the components a block composes.
  const subcomponent = !passthrough && names.every((entry) => componentName.test(entry));
  return {
    name,
    names: api ? [names[0].replace(/\(.*$/, '')] : names.flatMap((entry, index) => identifier.test(entry) ? [parts[index] ? parts[index][2] : entry.replace(/\(.*$/, '').replace(/^\.\.\./, '')] : []),
    ...(parts.some(Boolean) ? { part: (parts.find(Boolean))[1] } : subcomponent ? { part: names[0] } : {}),
    ...(api ? { api: true } : {}),
    ...(passthrough ? { passthrough: true } : {}),
    ...(subcomponent ? { subcomponent: true } : {}),
    type: type || null,
    default: empty(defaultValue) ? null : String(defaultValue),
    // Only an explicit marker counts ("Required. …", "(required) …"); descriptions often mention the `required` attribute.
    required: /^\s*(?:\(required\)|required[.:—-])/i.test(`${description}`),
    description: description || ''
  };
}

// A grouped row with one type per name ("shape / surface" typed "circle | square / solid | tinted") is
// several props: split it so each gets its own type and default. Rows sharing one type stay grouped.
function expandProps(row) {
  const [name, type, defaultValue, description] = row;
  if (/\bno props\b/i.test(`${type}`) || /^\(none\)$/i.test(String(name).trim())) return [];
  const names = splitNames(name);
  const types = type ? String(type).split(/\s+\/\s+/) : [];
  if (names.length < 2 || types.length !== names.length || !names.every((entry) => identifier.test(entry) && !componentName.test(entry))) return [prop(row)];
  const defaults = empty(defaultValue) ? [] : String(defaultValue).split(/\s+\/\s+/);
  return names.map((entry, index) => prop([entry, types[index], defaults.length === names.length ? defaults[index] : null, description]));
}

const literalUnion = (type) => {
  if (!type || !type.includes('|')) return null;
  const values = type.split('|').map((value) => value.trim().replace(/^['"]|['"]$/g, ''));
  const primitive = /^(?:string|number|boolean|null|undefined|ReactNode|false|true|object|function)$/;
  return values.every((value) => /^[\w.-]+$/.test(value) && !primitive.test(value)) ? values : null;
};

const readme = (ownerDir) => exists(`${ownerDir}README.md`) ? readText(`${ownerDir}README.md`).trim() : null;

async function buildComponents(entryExports, patterns) {
  const docsModules = await loadOwnerDocs();
  const catalogue = readJson('src/docs/catalogue/catalogue.json');
  const stories = Object.values(catalogue.entries).filter((entry) => entry.type === 'story');
  const docsEntries = Object.values(catalogue.entries).filter((entry) => entry.type === 'docs');
  const patternStoryIds = new Set(patterns.map((pattern) => pattern.storyId));
  const rootExports = new Set(entryExports['.'].exports);
  const components = [];
  const docTitles = new Set(Object.values(docsModules).flatMap((docs) => Object.keys(docs)));

  for (const [file, docs] of Object.entries(docsModules)) {
    const [, domain, owner] = file.match(/^src\/components\/([^/]+)\/([^/]+)\//);
    const ownerDir = `src/components/${domain}/${owner}/`;
    const entry = Object.values(entryExports)
      .filter((candidate) => candidate.target.startsWith(`./${ownerDir}`))
      .sort((a, b) => a.specifier.length - b.specifier.length)[0];
    const categoryEntry = entryExports[`./${domain}`];
    const titles = Object.keys(docs);
    for (const [title, doc] of Object.entries(docs)) {
      const name = title.split('/').pop();
      // Story titles may add a sidebar group (Core/Overlays/Dialog); owners documenting several titles match by name.
      const sameTitle = (storyTitle) => titles.length === 1 || storyTitle === title || storyTitle.endsWith(`/${name}`);
      const ownerStories = () => stories.filter((story) => story.importPath.startsWith(`./${ownerDir}`) && sameTitle(story.title) && !patternStoryIds.has(story.id));
      const candidate = name.replace(/\s+/g, '');
      const exportsList = entry?.exports || [];
      const mainExport = exportsList.includes(candidate) || exportsList.includes('default') ? candidate : exportsList.find((value) => /^[A-Z]/.test(value)) || candidate;
      const importKind = exportsList.includes(mainExport) || !exportsList.includes('default') ? 'named' : 'default';
      const props = (doc.props || []).flatMap(expandProps);
      const variants = Object.fromEntries(props.filter((entry) => entry.names.length === 1 && !entry.part && !entry.passthrough)
        .map((entry) => [entry.names[0], literalUnion(entry.type)]).filter(([, values]) => values));
      components.push({
        id: slug(title),
        name,
        kind: 'component',
        title,
        category: domain,
        owner: `${domain}/${owner}`,
        import: {
          path: entry?.specifier || null,
          category: categoryEntry?.specifier || null,
          root: rootExports.has(mainExport),
          mainExport,
          // Many owners only default-export their component; `line` is the import that actually works.
          kind: importKind,
          line: entry?.specifier ? (importKind === 'named' ? `import { ${mainExport} } from '${entry.specifier}';` : `import ${mainExport} from '${entry.specifier}';`) : null,
          exports: exportsList
        },
        description: doc.description || '',
        ...(doc.overview ? { overview: doc.overview } : {}),
        ...(doc.decisionRules?.length ? { decisionRules: doc.decisionRules } : {}),
        ...(doc.propsTitle ? { propsTitle: doc.propsTitle } : {}),
        props,
        variants,
        accessibility: doc.accessibility || '',
        ...Object.fromEntries(['notes', 'dos', 'donts', 'consumerResponsibilities', 'recovery'].filter((key) => doc[key]?.length).map((key) => [key, doc[key]])),
        usage: doc.usage || '',
        ...(doc.usageTitle ? { usageTitle: doc.usageTitle } : {}),
        examples: {
          stories: ownerStories(title).map((story) => ({ name: story.name, id: story.id })),
          patterns: patterns.filter((pattern) => pattern.storyTitle === title || (pattern.owner === `${domain}/${owner}` && !docTitles.has(pattern.storyTitle))).map((pattern) => ({ name: pattern.name, title: pattern.title, registry: pattern.name, storyId: pattern.storyId, imports: pattern.uses }))
        },
        storybook: docsEntries.find((entry) => entry.importPath.startsWith(`./${ownerDir}`) && sameTitle(entry.title))?.id || null,
        docs: `docs/llm/${slug(title)}.md`,
        source: ownerDir,
        readme: readme(ownerDir)
      });
    }
  }

  const hooks = await loadHookCatalogue();
  for (const hook of hooks.hookCatalogue) {
    const title = hooks.hookTitle(hook);
    components.push({
      id: slug(`hooks-${hook.name}`),
      name: hook.name,
      kind: 'hook',
      title,
      category: 'hooks',
      owner: `hooks/${hook.file.replace(/\.js$/, '')}`,
      import: {
        path: entryExports['./hooks'].specifier,
        category: entryExports['./hooks'].specifier,
        leaf: entryExports[`./hooks/${hook.file.replace(/\.js$/, '')}`]?.specifier || null,
        root: rootExports.has(hook.name),
        mainExport: hook.name,
        exports: entryExports[`./hooks/${hook.file.replace(/\.js$/, '')}`]?.exports || [hook.name]
      },
      description: hook.description || hook.summary,
      summary: hook.summary,
      group: hook.group,
      props: (hook.params || []).flatMap(expandProps),
      returns: (hook.returns || []).map(([name, type, description]) => ({ name, type, description })),
      variants: {},
      accessibility: hook.accessibility || '',
      ...(hook.notes?.length ? { notes: hook.notes } : {}),
      usage: hook.usage || '',
      examples: { stories: stories.filter((story) => story.title === title).map((story) => ({ name: story.name, id: story.id })), patterns: [] },
      storybook: hooks.hookDocsId(hook),
      docs: `docs/llm/${slug(`hooks-${hook.name}`)}.md`,
      source: `src/hooks/${hook.file}`,
      readme: null
    });
  }

  // Related: other owners named in the authored prose, then siblings documented by the same owner.
  const byName = new Map();
  for (const component of components) {
    for (const key of new Set([component.name.replace(/\s+/g, ''), component.import.mainExport])) {
      if (!byName.has(key) || component.category === 'core') byName.set(key, component.id);
    }
  }
  const names = [...byName.keys()].filter((key) => key.length > 2).sort((a, b) => b.length - a.length);
  const mention = new RegExp(`\\b(${names.map((key) => key.replace(/[$]/g, '\\$')).join('|')})\\b`, 'g');
  for (const component of components) {
    const prose = [component.description, component.overview, ...(component.decisionRules || []), ...(component.notes || []), component.accessibility, ...component.props.map((entry) => entry.description)].join(' ');
    const related = [...prose.matchAll(mention)].map((match) => byName.get(match[1]));
    const siblings = components.filter((other) => other.owner === component.owner && other.kind === component.kind).map((other) => other.id);
    component.related = [...new Set([...related, ...siblings])].filter((id) => id && id !== component.id).slice(0, 10);
  }

  return components.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.title.localeCompare(b.title));
}

function buildTokens(tokens) {
  const utilities = [];
  const walk = (value, prefix) => {
    if (typeof value === 'string') utilities.push(prefix);
    else for (const [key, child] of Object.entries(value)) walk(child, key === 'DEFAULT' ? prefix : `${prefix}-${key}`);
  };
  for (const [name, value] of Object.entries(tokens.semanticColors)) walk(value, name);
  const theme = readText('src/tokens/theme.css');
  for (const match of theme.matchAll(/^\s*--color-(ui-[\w-]+):/gm)) utilities.push(match[1]);
  const cssVariables = [...new Set([...readText('src/tokens/tokens.css').matchAll(/(--ds-[\w-]+)\s*:/g)].map((match) => match[1]))].sort();
  return {
    authority: 'src/tokens/tokens.css (runtime CSS); tokens.json is the JavaScript/preset projection exported from @gaudi/design-system/tokens.',
    import: `import tokens from '${PKG}/tokens';`,
    colors: {
      usage: 'Use semantic Tailwind utilities (bg-*, text-*, border-*, ring-*) built from these names, never raw hex or palette shades for UI state. Status colours always pair with text or an icon.',
      semanticUtilities: [...new Set(utilities)].sort(),
      semantic: tokens.semanticColors,
      variables: { root: tokens.dsVariables.root, dark: tokens.dsVariables.dark },
      palette: { names: tokens.paletteNames, shades: tokens.paletteShades }
    },
    spacing: {
      variable: '--ds-space-scale',
      usage: 'Inner padding, gaps and control heights scale with --ds-space-scale (default 1). Prefer gap-* over space-x/y-*. Component CSS uses calc(var(--ds-space-scale, 1) * <length>).',
      scales: tokens.spaceScales
    },
    radius: { variable: '--ds-radius', default: '4px', usage: 'All corners use --ds-radius (configurable down to 0px). Circles only for intrinsic shapes.', radii: tokens.radii },
    typography: tokens.typography,
    motion: tokens.motion,
    shadows: tokens.shadows,
    charts: tokens.chartPalettes,
    cssVariables
  };
}

function buildIcons(entryExports) {
  return {
    import: `import Icon from '${PKG}/core/Icon';`,
    registryImport: `import { iconRegistry, getIcon } from '${PKG}/icons';`,
    usage: "<Icon name='Info' size='md' color='primary' label='More information' /> — pass `label` when the icon carries meaning, `decorative` otherwise.",
    names: loadIconNames(),
    animated: { import: `import { AnimatedIcon } from '${PKG}/icons/AnimatedIcon';`, names: loadObjectKeys('src/icons/animated/registry.js', 'animatedIconRegistry').sort((a, b) => a.localeCompare(b)) },
    sizes: loadObjectKeys('src/icons/index.jsx', 'iconSizes'),
    colors: loadObjectKeys('src/icons/index.jsx', 'iconColors'),
    brands: Object.keys(entryExports).filter((subpath) => subpath.startsWith('./icons/brands/')).map((subpath) => `${PKG}${subpath.slice(1)}`)
  };
}

function buildSetup() {
  const peers = manifest.peerDependencies;
  const optional = Object.keys(manifest.peerDependenciesMeta || {}).filter((name) => manifest.peerDependenciesMeta[name].optional);
  return {
    package: PKG,
    version: manifest.version,
    install: {
      github: 'pnpm add github:ahmadassaf/design-system',
      npm: `pnpm add ${PKG}`,
      note: 'Until the package is published to npm, install from GitHub; the import name is always @gaudi/design-system.'
    },
    peerDependencies: peers,
    optionalPeers: Object.fromEntries(optional.map((name) => [name, name === 'recharts' ? 'Charts (@gaudi/design-system/charts)' : name === '@xyflow/react' ? 'Flow (@gaudi/design-system/core/Flow + flow.css)' : 'optional'])),
    styles: {
      global: { import: `import '${PKG}/global.css';`, use: 'Apps without their own Tailwind entry: loads Tailwind v4, Gaudi tokens, foundations and component CSS, and scans the package source.' },
      styles: { import: `import '${PKG}/styles.css';`, use: 'Apps that own their Tailwind entry: import after `@import "tailwindcss";` and add `@source` for the package.' },
      flow: { import: `import '${PKG}/flow.css';`, use: 'Only with the Flow component.' }
    },
    tailwind: {
      preset: `${PKG}/tailwind-preset`,
      usage: "Tailwind v4 loads Gaudi's config through global.css. For a JS config, use `presets: [require('@gaudi/design-system/tailwind-preset')]` (colours, radii, typography and the prose theme).",
      plugins: [`${PKG}/tailwind/addVariablesColors`, `${PKG}/tailwind/tailwindGrid`]
    },
    nextjs: { config: "transpilePackages: ['@gaudi/design-system']", note: 'Gaudi ships React source (JSX); a JSX-aware bundler is required.' },
    theming: {
      radius: ':root { --ds-radius: 4px; }',
      density: ':root { --ds-space-scale: 1; }',
      darkMode: 'Add the `dark` class on <html> (next-themes attribute="class").',
      themes: {
        presets: themePresetIds(),
        apply: `Set data-theme="<id>" on <html> and import '${PKG}/themes.css', or wrap the app in ThemeProvider from '${PKG}/themes' (injects and persists the active theme) and render getThemeScript() in <head> to avoid a flash.`,
        runtime: `import { ThemeProvider, useTheme, getThemeScript, applyTheme, listThemes } from '${PKG}/themes';`,
        contract: 'src/tokens/THEMING.md (themeable --ds-* tokens per mode, fonts, radius, shadows); schema themes/theme.schema.json.',
        cli: 'gaudi-ds theme list | import <file|url> | export <id> --format css|shadcn|registry|json | check <id> | generate --brand <colour>',
        storybook: 'The Theming guide (theming-overview--default) renders THEMING.md with live swatches, presets and contrast; the Theme Studio guide edits, generates and exports; the Theme preset toolbar previews any story in any preset.'
      }
    },
    imports: {
      rule: 'Prefer owner leaf entries (e.g. @gaudi/design-system/core/Button) in route code; root and category entries are valid. Only package.json exports are public; never import src/ paths.',
      entries: Object.keys(manifest.exports).length
    }
  };
}

const themePresetIds = () => readdirSync(path.join(root, 'themes/presets')).filter((file) => file.endsWith('.json')).map((file) => file.replace(/\.json$/, '')).sort();

function llmsIndex({ components, blocks, tokens }) {
  const lines = [
    `# Gaudi Design System (${PKG})`, '',
    `> ${manifest.description} React 19 source components with Tailwind CSS v4, semantic tokens, accessibility, RTL-aware layout and copy-in blocks. Version ${manifest.version}.`, '',
    'Install from GitHub until the package is on npm: `pnpm add github:ahmadassaf/design-system`. Import from `@gaudi/design-system` (root), category entries (`/core`, `/chat`, `/charts`, `/animations`, `/blocks`, `/hooks`, `/mdx`, `/post`, `/layout`) or owner leaf entries such as `@gaudi/design-system/core/Button`. Load `@gaudi/design-system/global.css` once (or `styles.css` when the app owns its Tailwind entry). In Next.js add `transpilePackages: [\'@gaudi/design-system\']`. Peers: react, react-dom, next, next-themes, tailwindcss; optional recharts (charts) and @xyflow/react (Flow). A JS Tailwind preset is available at `@gaudi/design-system/tailwind-preset`.', '',
    'Generated by `pnpm ai:build` from component docs, READMEs, stories and the catalogue. Links are relative to the repository root.', '',
    '## Getting started', '',
    '- [Project setup](ai/setup.json): install, peers, stylesheets, Tailwind preset, Next.js config, theming variables',
    '- [Full reference](llms-full.txt): every component page concatenated',
    '- [Agent skill](skills/gaudi-design-system/SKILL.md): workflow and rules for building UI with Gaudi',
    '- [README](README.md): package usage and development', '',
    '## Foundations', '',
    `- [Tokens](ai/tokens.json): ${tokens.colors.semanticUtilities.length} semantic colour utilities (e.g. \`bg-surface\`, \`text-text-muted\`, \`border-border\`, \`bg-accent\`), spacing scales (${Object.keys(tokens.spacing.scales).join(', ')}) via \`--ds-space-scale\`, radius via \`--ds-radius\`, typography, motion, shadows and chart palettes`,
    '- [Icons](ai/icons.json): registry names for `<Icon name="…" />`, animated icons, sizes, colours and brand marks',
    '- [Components index](ai/components.json): machine-readable API metadata for every component and hook', ''
  ];
  for (const [key, label, description] of categories) {
    const members = components.filter((component) => component.category === key);
    if (!members.length) continue;
    lines.push(`## ${label}`, '', description, '');
    for (const component of members) lines.push(`- [${component.name}](${component.docs}): ${(component.summary || component.description).split(/(?<=\.)\s/)[0]}`);
    lines.push('');
  }
  lines.push('## Blocks & patterns', '', `${blocks.filter((block) => block.type === 'registry:block').length} copy-in blocks and ${blocks.filter((block) => block.type === 'registry:example').length} component patterns. They import components from \`${PKG}\`; nothing is copied except the composition. Index: [ai/blocks.json](ai/blocks.json).`, '');
  const families = [...new Set(blocks.filter((block) => block.type === 'registry:block').map((block) => block.family))];
  for (const family of families) {
    const members = blocks.filter((block) => block.family === family);
    lines.push(`- ${family} (${members.length}): ${members.map((block) => `\`${block.name}\` ${block.title}`).join('; ')}`);
  }
  lines.push('',
    '## MCP & agent skills', '',
    '- MCP server (stdio): `claude mcp add gaudi-ds -- npx -y @gaudi/design-system mcp` (before publishing: `claude mcp add gaudi-ds -- node /path/to/design-system/bin/gaudi-ds.mjs mcp`). Tools: search, list_components, get_component, get_examples, list_blocks, get_block, get_tokens, get_install_command, validate_usage, get_agent_skill, get_project_setup, list_themes, get_theme, import_theme, export_theme.',
    '- Agent skill: `npx @gaudi/design-system skills install --agent claude|cursor|codex|windsurf|opencode|vscode|all [--dir <project>]`.', '',
    '## Theming', '',
    `Themes override the semantic \`--ds-*\` contract (surfaces, text, borders, accent, focus, status, charts, sidebar; shadows per mode; fonts, radius, density) for light and dark: [THEMING.md](src/tokens/THEMING.md), [schema](themes/theme.schema.json). Presets: ${themePresetIds().map((id) => `\`${id}\``).join(', ')} ([themes/presets](themes/presets)). Apply with \`data-theme="<id>"\` on <html> plus \`${PKG}/themes.css\`, or \`ThemeProvider\`/\`useTheme\`/\`getThemeScript\`/\`applyTheme\` from \`${PKG}/themes\`. Bring any [StyleGlide](https://www.styleglide.ai/themes), [tweakcn](https://tweakcn.com) or [shadcn/ui](https://ui.shadcn.com/themes) theme: the contract follows the shadcn CSS-variable convention, so their CSS imports as-is with \`gaudi-ds theme import <file|url>\` (or the import_theme MCP tool); Theme Studio is inspired by those tools. export with \`gaudi-ds theme export <id> --format css|shadcn|registry|json\`; presets are also registry items (\`theme-<id>\`). Storybook: the Theming guide (\`theming-overview--default\`, THEMING.md with live swatches and previews), the Theme Studio guide and the Theme preset toolbar.`, '',
    '## Registry', '',
    'shadcn-compatible registry for blocks and patterns (`registry.json`, built to `public/r/<name>.json` by `pnpm registry:build`). Add `"registries": { "@gaudi": "<base-url>/r/{name}.json" }` to your components.json, then `npx shadcn@latest add @gaudi/<name>`; locally: `npx shadcn@latest add ./public/r/<name>.json`.', '',
    '## Credits', '',
    'This file follows the [llms.txt proposal](https://llmstxt.org). Pattern examples and app-shell layouts are inspired by [reui](https://reui.io), as are the [agent skill](https://reui.io/docs/agent-skills), [MCP server](https://reui.io/docs/mcp), [registry](https://reui.io/docs/registry) and [llms.txt](https://reui.io/llms.txt) setup. The registry follows the [shadcn registry spec](https://ui.shadcn.com/docs/registry); the server uses the [Model Context Protocol](https://modelcontextprotocol.io) and its official TypeScript SDK (`@modelcontextprotocol/sdk`, MIT). Third-party notices: README.md#third-party-notices.', '');
  return lines.join('\n');
}

function llmsFull({ components, blocks, index }) {
  const parts = [index.split('\n## Getting started')[0].trim(), ''];
  for (const component of components) parts.push('---', '', componentMarkdown(component, { packageName: PKG }));
  parts.push('---', '', '# Blocks & patterns', '');
  for (const block of blocks.filter((entry) => entry.type === 'registry:block')) parts.push(blockMarkdown(block));
  return `${parts.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

function skillCatalogue({ components, blocks }) {
  const lines = ['# Gaudi catalogue', '', `Generated by \`pnpm ai:build\` for ${PKG} ${manifest.version}. Read the full API with \`get_component\` or the matching section of llms-full.txt before use.`, ''];
  for (const [key, label, description] of categories) {
    const members = components.filter((component) => component.category === key);
    if (!members.length) continue;
    lines.push(`## ${label}`, '', description, '', '| Component | Import | Purpose |', '| --- | --- | --- |');
    for (const component of members) {
      lines.push(`| ${component.name} | \`${component.import.path}\` | ${(component.summary || component.description).split(/(?<=\.)\s/)[0].replace(/\|/g, '\\|')} |`);
    }
    lines.push('');
  }
  lines.push('## Blocks', '', 'Copy-in compositions (registry type `registry:block`); install with `npx shadcn@latest add @gaudi/<name>`.', '');
  for (const family of [...new Set(blocks.filter((block) => block.type === 'registry:block').map((block) => block.family))]) {
    lines.push(`- **${family}**: ${blocks.filter((block) => block.family === family).map((block) => `\`${block.name}\` ${block.title}`).join('; ')}`);
  }
  lines.push('', `Component patterns: ${blocks.filter((block) => block.type === 'registry:example').length} more items (\`list_blocks\` with \`type: "pattern"\`).`, '');
  return lines.join('\n');
}

const outputs = new Map();
const emit = (file, content) => outputs.set(file, content);

const entryExports = await loadEntryExports(manifest);
const patterns = await derivePatterns();
const components = await buildComponents(entryExports, patterns);
const blocks = patterns.map(({ source: _source, ...pattern }) => pattern);
const tokens = buildTokens(readJson('src/tokens/tokens.json'));
const meta = { package: PKG, version: manifest.version, generatedBy: 'pnpm ai:build' };

emit('ai/components.json', json({ ...meta, categories: categories.map(([key, label, description]) => ({ key, label, description, count: components.filter((component) => component.category === key).length })), components }));
emit('ai/blocks.json', json({ ...meta, registry: { namespace: '@gaudi', url: '<base-url>/r/{name}.json', local: 'public/r/{name}.json' }, blocks }));
emit('ai/tokens.json', json({ ...meta, ...tokens }));
emit('ai/icons.json', json({ ...meta, ...buildIcons(entryExports) }));
emit('ai/setup.json', json({ ...meta, ...buildSetup() }));
emit('ai/exports.json', json({ ...meta, entries: Object.fromEntries(Object.keys(manifest.exports).map((subpath) => [`${PKG}${subpath === '.' ? '' : subpath.slice(1)}`, entryExports[subpath]?.exports || []])) }));
for (const component of components) emit(component.docs, componentMarkdown(component, { packageName: PKG }));
emit('skills/gaudi-design-system/references/catalogue.md', skillCatalogue({ components, blocks }));
const index = llmsIndex({ components, blocks, tokens });
emit('llms.txt', index);
emit('llms-full.txt', llmsFull({ components, blocks, index }));

const stale = [];
const managedDocs = new Set([...outputs.keys()].filter((file) => file.startsWith('docs/llm/')));
const existingDocs = exists('docs/llm') ? readdirSync(path.join(root, 'docs/llm')).map((file) => `docs/llm/${file}`) : [];
for (const [file, content] of outputs) {
  const target = path.join(root, file);
  const current = exists(file) ? readFileSync(target, 'utf8') : null;
  if (current === content) continue;
  if (check) stale.push(file);
  else {
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}
for (const file of existingDocs.filter((entry) => !managedDocs.has(entry))) {
  if (check) stale.push(file);
  else rmSync(path.join(root, file));
}
if (stale.length) throw new Error(`AI metadata is stale (${stale.slice(0, 5).join(', ')}${stale.length > 5 ? '…' : ''}). Run pnpm ai:build.`);
console.log(`AI metadata ${check ? 'is current' : 'written'}: ${components.filter((c) => c.kind === 'component').length} components, ${components.filter((c) => c.kind === 'hook').length} hooks, ${blocks.length} blocks/patterns, ${managedDocs.size} doc pages.`);
