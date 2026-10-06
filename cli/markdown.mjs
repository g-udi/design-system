// Markdown renderers shared by `pnpm ai:build` (docs/llm, llms-full.txt) and the MCP server, so the
// generated docs and the tool responses always say the same thing.

const cell = (value) => String(value ?? '—').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const list = (items) => items.map((item) => `- ${item}`).join('\n');

export function importSnippet(component) {
  const { path, exports = [], mainExport } = component.import || {};
  if (!path) return '';
  if (component.kind === 'hook') return `import { ${component.name} } from '${path}';`;
  if (exports.includes('default')) return `import ${mainExport || component.name.replace(/\s+/g, '')} from '${path}';`;
  const named = mainExport && exports.includes(mainExport) ? mainExport : exports.find((name) => /^[A-Z]/.test(name));
  return named ? `import { ${named} } from '${path}';` : `import * as ${component.name.replace(/\W+/g, '')} from '${path}';`;
}

export function propsTable(props, title = 'Props') {
  if (!props?.length) return '';
  const rows = props.map((prop) => `| \`${cell(prop.name)}\` | \`${cell(prop.type)}\` | ${prop.default == null ? '—' : `\`${cell(prop.default)}\``} | ${prop.required ? 'yes' : 'no'} | ${cell(prop.description)} |`);
  return [`## ${title}`, '', '| Name | Type | Default | Required | Description |', '| --- | --- | --- | --- | --- |', ...rows].join('\n');
}

/** Per-component reference: API table, usage, accessibility, variants and examples. */
export function componentMarkdown(component, { packageName = '@gaudi/design-system' } = {}) {
  const sections = [`# ${component.name}`, '', `> ${component.title} · ${component.category} · \`${component.import?.path || packageName}\``, '', component.description];
  if (component.overview) sections.push('', component.overview);
  const imports = [importSnippet(component)];
  if (component.import?.category && component.import.category !== component.import.path) imports.push(`// also: import { … } from '${component.import.category}';`);
  sections.push('', '## Import', '', '```js', ...imports.filter(Boolean), '```');
  if (component.import?.exports?.length) sections.push('', `Exports: ${component.import.exports.map((name) => `\`${name}\``).join(', ')}`);
  if (component.decisionRules?.length) sections.push('', '## When to use', '', list(component.decisionRules));
  const table = propsTable(component.props, component.propsTitle || (component.kind === 'hook' ? 'Parameters' : 'Props'));
  if (table) sections.push('', table);
  if (component.returns?.length) {
    sections.push('', '## Returns', '', '| Name | Type | Description |', '| --- | --- | --- |',
      ...component.returns.map((entry) => `| \`${cell(entry.name)}\` | \`${cell(entry.type)}\` | ${cell(entry.description)} |`));
  }
  const variants = Object.entries(component.variants || {});
  if (variants.length) sections.push('', '## Variants', '', list(variants.map(([prop, values]) => `\`${prop}\`: ${values.map((value) => `\`${value}\``).join(', ')}`)));
  if (component.usage) sections.push('', `## ${component.usageTitle || 'Usage'}`, '', '```jsx', component.usage.trim(), '```');
  if (component.accessibility) sections.push('', '## Accessibility', '', component.accessibility);
  for (const [key, heading] of [['notes', 'Notes'], ['dos', 'Do'], ['donts', 'Don’t'], ['consumerResponsibilities', 'Consumer responsibilities'], ['recovery', 'States and recovery']]) {
    if (component[key]?.length) sections.push('', `## ${heading}`, '', list(component[key]));
  }
  const { stories = [], patterns = [] } = component.examples || {};
  if (stories.length || patterns.length) {
    sections.push('', '## Examples');
    if (stories.length) sections.push('', list(stories.map((story) => `${story.name} (Storybook \`${story.id}\`)`)));
    if (patterns.length) {
      sections.push('', 'Curated patterns:', '', list(patterns.map((pattern) => `${pattern.title}${pattern.registry ? ` — registry item \`@gaudi/${pattern.registry}\`` : ''}${pattern.imports?.length ? ` (uses ${pattern.imports.map((name) => `\`${name}\``).join(', ')})` : ''}`)));
    }
  }
  if (component.related?.length) sections.push('', '## Related', '', component.related.map((id) => `\`${id}\``).join(', '));
  if (component.readme) sections.push('', '## README', '', component.readme.replace(/^#\s.*\n+/, '').replace(/^(#+)\s/gm, '#$1 ').trim());
  return `${sections.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

export function blockMarkdown(block) {
  return [
    `# ${block.title}`, '', `> Registry item \`@gaudi/${block.name}\` · ${block.family} · builds on \`${block.owner}\``, '', block.description, '',
    '## Install', '', '```sh', block.install.registry, '# local file, before hosting:', block.install.local, '```', '',
    `Uses: ${block.uses.map((name) => `\`${name}\``).join(', ')}`,
    block.dependencies.length ? `\nnpm dependencies: ${block.dependencies.map((name) => `\`${name}\``).join(', ')}` : ''
  ].join('\n').trim() + '\n';
}
