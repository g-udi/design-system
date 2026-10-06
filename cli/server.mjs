// Gaudi MCP server (stdio). Serves the generated ai/ metadata; it never reads the network.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { blockMarkdown, componentMarkdown, importSnippet } from './markdown.mjs';
import { findBlock, findComponent, loadMetadata, readBlockItem, readSkill } from './metadata.mjs';
import { search, suggest } from './search.mjs';
import { validateUsage } from './validate.mjs';
import { listThemeSummaries, resolveTheme } from './themes.mjs';
import { checkContrast } from '../src/themes/contrast.js';
import { exportTheme, THEME_EXPORT_FORMATS } from '../src/themes/exporter.js';
import { importTheme } from '../src/themes/importer.js';

const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
const failure = (message) => ({ ...text(message), isError: true });
const TOKEN_KINDS = ['colors', 'spacing', 'radius', 'typography', 'motion', 'shadows', 'charts', 'variables', 'icons'];

function notFound(metadata, name) {
  const suggestions = suggest(metadata, name);
  return failure(`No Gaudi component or block named "${name}".${suggestions.length ? ` Did you mean: ${suggestions.join(', ')}?` : ' Use search or list_components.'}`);
}

export function createServer(metadata = loadMetadata()) {
  const server = new McpServer({ name: 'gaudi-ds', version: metadata.version }, {
    instructions: `Gaudi Design System (${metadata.package}). Find components with search/list_components, read the real API with get_component before writing code, import from the exact public entry it reports, compose with semantic tokens (get_tokens), and check the result with validate_usage. Never invent props. Copy-in blocks come from list_blocks/get_block.`
  });
  const categoryKeys = metadata.categories.map((category) => category.key);

  server.registerTool('search', {
    title: 'Search Gaudi',
    description: 'Scored search across components, hooks, blocks and patterns by name, purpose, props and example titles. Use first when you know the need but not the owner.',
    inputSchema: { query: z.string().min(1), category: z.string().optional().describe(`One of: ${categoryKeys.join(', ')}`), limit: z.number().int().min(1).max(50).optional() },
    annotations: { readOnlyHint: true }
  }, async ({ query, category, limit }) => text(search(metadata, query, { category, limit })));

  server.registerTool('list_components', {
    title: 'List components',
    description: 'Lists components and hooks with their import path and one-line description, grouped by category.',
    inputSchema: { category: z.string().optional().describe(`One of: ${categoryKeys.join(', ')}`) },
    annotations: { readOnlyHint: true }
  }, async ({ category }) => {
    const wanted = category?.toLowerCase();
    if (wanted && !categoryKeys.includes(wanted)) return failure(`Unknown category "${category}". Use one of: ${categoryKeys.join(', ')}.`);
    return text(metadata.categories.filter((entry) => !wanted || entry.key === wanted).map((entry) => ({
      category: entry.key,
      description: entry.description,
      components: metadata.components.filter((component) => component.category === entry.key)
        .map((component) => ({ id: component.id, name: component.name, import: component.import.path, description: (component.summary || component.description).split(/(?<=\.)\s/)[0] }))
    })));
  });

  server.registerTool('get_component', {
    title: 'Get component API',
    description: 'Full API for one component or hook: import, exports, props (type/default/required), variants, usage, accessibility, notes and examples. Accepts "Button", "core/Button", "core-button" or an export name.',
    inputSchema: { name: z.string().min(1), format: z.enum(['markdown', 'json']).optional() },
    annotations: { readOnlyHint: true }
  }, async ({ name, format = 'markdown' }) => {
    const { match, candidates } = findComponent(metadata, name);
    if (!match) return notFound(metadata, name);
    const others = candidates.filter((id) => id !== match.id);
    const note = others.length ? `\n\n_Other matches: ${others.join(', ')}_\n` : '';
    return format === 'json' ? text(match) : text(componentMarkdown(match, { packageName: metadata.package }) + note);
  });

  server.registerTool('get_examples', {
    title: 'Get examples',
    description: 'Usage snippet, Storybook stories and curated patterns (with registry install commands) for a component.',
    inputSchema: { name: z.string().min(1) },
    annotations: { readOnlyHint: true }
  }, async ({ name }) => {
    const { match } = findComponent(metadata, name);
    if (!match) return notFound(metadata, name);
    return text({
      component: match.id,
      import: importSnippet(match),
      usage: match.usage,
      stories: match.examples.stories,
      patterns: match.examples.patterns.map((pattern) => ({ ...pattern, install: findBlock(metadata, pattern.name)?.install })),
      next: 'Call get_block(<pattern name>) for the full copy-in source.'
    });
  });

  server.registerTool('list_blocks', {
    title: 'List blocks and patterns',
    description: 'Copy-in registry items: page-level blocks (app shells, screens, dashboards, forms, scheduling, stat cards, chat) and component patterns. They import Gaudi components from the package.',
    inputSchema: { family: z.string().optional().describe('e.g. app-shell, screens, dashboard, forms, accordion'), type: z.enum(['block', 'pattern', 'all']).optional() },
    annotations: { readOnlyHint: true }
  }, async ({ family, type = 'block' }) => {
    const blocks = metadata.blocks.filter((block) => (!family || block.family === family) &&
      (type === 'all' || (type === 'block') === (block.type === 'registry:block')));
    return text(blocks.map((block) => ({ name: block.name, type: block.type, family: block.family, title: block.title, owner: block.owner, install: block.install.registry })));
  });

  server.registerTool('get_block', {
    title: 'Get block',
    description: 'One block or pattern: description, the Gaudi components it uses, npm dependencies, install commands and its source when the registry has been built locally.',
    inputSchema: { name: z.string().min(1) },
    annotations: { readOnlyHint: true }
  }, async ({ name }) => {
    const block = findBlock(metadata, name);
    if (!block) return notFound(metadata, name);
    const item = readBlockItem(metadata, block.name);
    const source = item?.files?.map((file) => `// ${file.path}\n${file.content}`).join('\n\n');
    return text(`${blockMarkdown(block)}\n${source ? `## Source\n\n\`\`\`jsx\n${source}\n\`\`\`\n` : '_Source is in the registry item (public/r). Run `pnpm registry:build` in the design-system repository, or install it with the command above once the registry is hosted._\n'}`);
  });

  server.registerTool('get_tokens', {
    title: 'Get design tokens',
    description: 'Semantic colour utilities and variables, spacing scales, radius, typography, motion, shadows, chart palettes, CSS variables or icon names.',
    inputSchema: { kind: z.enum(TOKEN_KINDS).optional() },
    annotations: { readOnlyHint: true }
  }, async ({ kind }) => {
    const { tokens, icons } = metadata;
    if (!kind) return text({ authority: tokens.authority, import: tokens.import, kinds: TOKEN_KINDS, colors: { usage: tokens.colors.usage, semanticUtilities: tokens.colors.semanticUtilities }, spacing: tokens.spacing, radius: tokens.radius });
    if (kind === 'icons') return text(icons);
    if (kind === 'variables') return text(tokens.cssVariables);
    return text(tokens[kind]);
  });

  server.registerTool('get_install_command', {
    title: 'Get install command',
    description: 'How to get something into a project: the npm install + exact import for components and hooks, or the shadcn registry command for blocks and patterns.',
    inputSchema: { name: z.string().min(1) },
    annotations: { readOnlyHint: true }
  }, async ({ name }) => {
    const block = findBlock(metadata, name);
    if (block) return text({ kind: block.type, name: block.name, ...block.install, dependencies: block.dependencies, registriesConfig: { registries: { '@gaudi': '<base-url>/r/{name}.json' } } });
    const { match } = findComponent(metadata, name);
    if (match) {
      return text({
        kind: match.kind, id: match.id,
        install: metadata.setup.install,
        import: importSnippet(match),
        alternatives: [match.import.category && `import { ${match.import.mainExport} } from '${match.import.category}';`, match.import.root && `import { ${match.import.mainExport} } from '${metadata.package}';`].filter(Boolean),
        css: metadata.setup.styles.global.import,
        peers: match.category === 'charts' ? ['recharts'] : match.owner === 'core/Flow' ? ['@xyflow/react', `import '${metadata.package}/flow.css';`] : []
      });
    }
    return notFound(metadata, name);
  });

  server.registerTool('validate_usage', {
    title: 'Validate usage',
    description: 'Checks JSX/JS that uses Gaudi: public import paths and export names, documented props and variant values, accessible names, hard-coded English in label props, physical (non-RTL) classes and raw colours.',
    inputSchema: { code: z.string().min(1) },
    annotations: { readOnlyHint: true }
  }, async ({ code }) => text(validateUsage(metadata, code)));

  server.registerTool('get_agent_skill', {
    title: 'Get agent skill',
    description: 'Returns the Gaudi agent skill (SKILL.md): component decision tables, workflow and a11y/RTL/i18n rules.',
    annotations: { readOnlyHint: true }
  }, async () => text(readSkill(metadata.root)));

  server.registerTool('get_project_setup', {
    title: 'Get project setup',
    description: 'Install command, peer dependencies, stylesheet imports, Tailwind preset, Next.js config and theming variables.',
    annotations: { readOnlyHint: true }
  }, async () => text(metadata.setup));

  server.registerTool('list_themes', {
    title: 'List themes',
    description: 'Shipped Gaudi theme presets (id, name, description, tags). Apply one with data-theme="<id>" on <html> plus @gaudi/design-system/themes.css, or ThemeProvider from @gaudi/design-system/themes.',
    annotations: { readOnlyHint: true }
  }, async () => text({ themes: listThemeSummaries(), contract: 'src/tokens/THEMING.md', schema: 'themes/theme.schema.json' }));

  server.registerTool('get_theme', {
    title: 'Get theme',
    description: 'One preset as Gaudi theme JSON (light/dark colour tokens, shadows, fonts, radius) with its WCAG AA contrast report.',
    inputSchema: { id: z.string().min(1) },
    annotations: { readOnlyHint: true }
  }, async ({ id }) => {
    try {
      const theme = resolveTheme(id, { cwd: metadata.root });
      const report = checkContrast(theme);
      return text({ theme, contrast: { pass: report.pass, checked: report.checked, failures: report.failures } });
    } catch (error) { return failure(error.message); }
  });

  server.registerTool('import_theme', {
    title: 'Import theme',
    description: 'Convert shadcn/tweakcn/StyleGlide theme CSS (:root/.dark variables in OKLCH, HSL or hex) or a shadcn registry item into Gaudi theme JSON. Any theme from StyleGlide (https://www.styleglide.ai/themes), tweakcn (https://tweakcn.com) or shadcn/ui (https://ui.shadcn.com/themes) can be pasted as-is: Gaudi follows the shadcn CSS-variable convention. Derives Gaudi-only tokens and returns a WCAG AA contrast report. Set repair to nudge failing pairs.',
    inputSchema: { source: z.string().min(1).describe('Theme CSS or registry/theme JSON text'), id: z.string().optional(), name: z.string().optional(), repair: z.boolean().optional() },
    annotations: { readOnlyHint: true }
  }, async ({ source, id, name, repair }) => {
    try {
      const { theme, report, warnings, format } = importTheme(source, { id, name, repair });
      return text({ format, theme, warnings, contrast: { pass: report.pass, checked: report.checked, failures: report.failures } });
    } catch (error) { return failure(error.message); }
  });

  server.registerTool('export_theme', {
    title: 'Export theme',
    description: 'Export a preset id or Gaudi theme JSON as scoped Gaudi CSS ([data-theme]), shadcn-compatible CSS variables, a shadcn registry item (registry:theme) or theme JSON.',
    inputSchema: { theme: z.string().min(1).describe('Preset id or Gaudi theme JSON text'), format: z.enum(THEME_EXPORT_FORMATS).optional() },
    annotations: { readOnlyHint: true }
  }, async ({ theme, format = 'css' }) => {
    try {
      const resolved = theme.trim().startsWith('{') ? importTheme(theme).theme : resolveTheme(theme, { cwd: metadata.root });
      return text(exportTheme(resolved, format));
    } catch (error) { return failure(error.message); }
  });

  server.registerPrompt('build', {
    title: 'Build UI with Gaudi',
    description: 'Plan and build an interface using only Gaudi components, tokens and blocks.',
    argsSchema: { task: z.string().describe('What to build, e.g. "a settings page with profile and notification sections"') }
  }, ({ task }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Build this with ${metadata.package}: ${task}\n\n1. search (and list_blocks) for matching owners and blocks; prefer an existing block to start from.\n2. get_component for every component you will use; use only documented props and variant values.\n3. Import from the exact public entries reported (leaf entries such as ${metadata.package}/core/Button).\n4. Compose with semantic token utilities (get_tokens), logical properties (ms/me/ps/pe/start/end), gap-*, visible labels and accessible names; take user-facing strings from props so they can be translated.\n5. Run validate_usage on the final code and fix every error and warning.`
      }
    }]
  }));

  return server;
}

export async function startServer() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
