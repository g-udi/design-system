// Static checks for code that uses @gaudi/design-system, driven by the generated metadata:
// public imports and export names, documented props and variant values, hard-coded English in
// label props, physical (non-RTL) layout classes and raw colours instead of semantic tokens.

const UNIVERSAL_PROPS = new Set(['key', 'ref', 'className', 'style', 'id', 'children', 'role', 'tabIndex', 'title', 'dir', 'lang', 'hidden', 'asChild', 'render', 'as']);
const LABEL_PROP = /(?:^|[a-z])(?:label|Label|placeholder|Placeholder|title|Title|description|Description|message|Message|text|Text|heading|Heading|caption|Caption)$/;
const PHYSICAL = {
  ml: 'ms', mr: 'me', pl: 'ps', pr: 'pe', left: 'start', right: 'end',
  'border-l': 'border-s', 'border-r': 'border-e', 'rounded-l': 'rounded-s', 'rounded-r': 'rounded-e',
  'rounded-tl': 'rounded-ss', 'rounded-tr': 'rounded-se', 'rounded-bl': 'rounded-es', 'rounded-br': 'rounded-ee',
  'text-left': 'text-start', 'text-right': 'text-end', 'float-left': 'float-start', 'float-right': 'float-end',
  'scroll-ml': 'scroll-ms', 'scroll-mr': 'scroll-me', 'scroll-pl': 'scroll-ps', 'scroll-pr': 'scroll-pe'
};
const PHYSICAL_TOKEN = new RegExp(`^-?(${Object.keys(PHYSICAL).sort((a, b) => b.length - a.length).join('|')})(?:-(.+))?$`);
const PALETTE = /^(?:bg|text|border|ring|fill|stroke|outline|from|to|via|divide|placeholder|decoration|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?(?:\/\d+)?$/;

const lineOf = (code, index) => code.slice(0, index).split('\n').length;

export function parseImports(code) {
  const imports = [];
  const pattern = /^\s*import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]|^\s*import\s+['"]([^'"]+)['"]/gm;
  for (const match of code.matchAll(pattern)) {
    const specifier = match[2] || match[3];
    const bindings = [];
    const clause = match[1] || '';
    const defaultName = clause.match(/^\s*([A-Za-z_$][\w$]*)\s*(?:,|$)/);
    if (defaultName) bindings.push({ imported: 'default', local: defaultName[1] });
    const namespace = clause.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/);
    if (namespace) bindings.push({ imported: '*', local: namespace[1] });
    for (const named of clause.match(/\{([\s\S]*?)\}/)?.[1].split(',') || []) {
      const [imported, local = imported] = named.trim().replace(/^type\s+/, '').split(/\s+as\s+/).map((part) => part.trim());
      if (imported) bindings.push({ imported, local });
    }
    imports.push({ specifier, bindings, line: lineOf(code, match.index) });
  }
  return imports;
}

/** JSX opening tags with attribute names and literal values; brace-aware so arrow functions do not end a tag. */
export function parseJsx(code) {
  const elements = [];
  for (const match of code.matchAll(/<([A-Z][\w$]*(?:\.[A-Z][\w$]*)?)(?=[\s/>])/g)) {
    let index = match.index + match[0].length;
    let depth = 0;
    let quote = null;
    let braceStart = 0;
    let body = '';
    for (; index < code.length; index += 1) {
      const char = code[index];
      if (quote) {
        if (char === quote && code[index - 1] !== '\\') quote = null;
        if (depth === 0) body += char;
        continue;
      }
      if (char === '{') {
        if (depth === 0) braceStart = index;
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          // Keep a lone string literal ({'Save'}); collapse any other expression to {}.
          const literal = code.slice(braceStart + 1, index).trim().match(/^(['"`])([^'"`]*)\1$/);
          body += literal ? `{${literal[1]}${literal[2]}${literal[1]}}` : '{}';
        }
      } else if (depth === 0) {
        if (char === '>') break;
        if (char === '"' || char === "'") quote = char;
        body += char;
      } else if (char === '"' || char === "'" || char === '`') quote = char;
    }
    const attributes = [];
    for (const attribute of body.matchAll(/(?:^|\s)(\.\.\.)?([A-Za-z_$][\w$:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:(['"`])([^'"`]*)\5)?[^}]*\}))?/g)) {
      if (attribute[1]) continue;
      const literal = attribute[3] ?? attribute[4] ?? attribute[6];
      attributes.push({ name: attribute[2], literal: literal === undefined ? null : literal });
    }
    elements.push({ tag: match[1], attributes, line: lineOf(code, match.index) });
  }
  return elements;
}

function classStrings(code) {
  const strings = [];
  const push = (value, index) => value && strings.push({ value, line: lineOf(code, index) });
  for (const match of code.matchAll(/className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*[`'"]([^`'"]*)[`'"]\s*\})/g)) push(match[1] ?? match[2] ?? match[3], match.index);
  for (const match of code.matchAll(/\b(?:cn|clsx|cx|twMerge|cva)\(([^)]*)\)/g)) {
    for (const literal of match[1].matchAll(/(['"`])([^'"`]*)\1/g)) push(literal[2], match.index);
  }
  return strings;
}

export function validateUsage(metadata, code) {
  const errors = [];
  const warnings = [];
  const info = [];
  const exportsBySpecifier = metadata.exports || {};
  const packageName = metadata.package;
  const localComponents = new Map();

  for (const { specifier, bindings, line } of parseImports(code)) {
    if (specifier !== packageName && !specifier.startsWith(`${packageName}/`)) continue;
    const available = exportsBySpecifier[specifier];
    if (!available) {
      const hint = /\/(?:src|components)\//.test(specifier) ? ' Private source paths are not public; use an owner entry such as @gaudi/design-system/core/Button.' : '';
      errors.push({ rule: 'import-path', line, message: `"${specifier}" is not a public entry of ${packageName}.${hint}` });
      continue;
    }
    for (const { imported, local } of bindings) {
      if (imported === '*') continue;
      if (!available.includes(imported)) {
        const suggestion = Object.entries(exportsBySpecifier).find(([, names]) => names.includes(imported))?.[0];
        errors.push({ rule: 'import-name', line, message: `"${imported === 'default' ? `default (${local})` : imported}" is not exported by ${specifier}.${suggestion ? ` It is exported by ${suggestion}.` : ''}` });
        continue;
      }
      const component = metadata.components.find((entry) => entry.kind === 'component' && (
        (imported === 'default' && entry.import.path === specifier) ||
        (imported !== 'default' && entry.import.mainExport === imported && (entry.import.path === specifier || entry.import.category === specifier || specifier === packageName))));
      if (component) localComponents.set(local, component);
    }
  }

  for (const element of parseJsx(code)) {
    const component = localComponents.get(element.tag);
    if (!component) continue;
    const documented = component.props.filter((prop) => !prop.part).flatMap((prop) => prop.names || [prop.name]);
    const passed = new Set(element.attributes.map((attribute) => attribute.name));
    for (const { name, literal } of element.attributes) {
      const allowed = UNIVERSAL_PROPS.has(name) || /^(?:aria|data)-/.test(name) || documented.includes(name) || /^on[A-Z]/.test(name);
      if (!allowed && documented.length) {
        warnings.push({ rule: 'unknown-prop', line: element.line, message: `<${element.tag}> has no documented prop "${name}". Documented: ${documented.join(', ')}. Check get_component("${component.id}") instead of inventing props.` });
      }
      const values = component.variants?.[name];
      if (values && literal !== null && !values.includes(literal)) {
        errors.push({ rule: 'variant-value', line: element.line, message: `<${element.tag} ${name}="${literal}"> is not a supported value. Use one of: ${values.join(', ')}.` });
      }
      if (literal && LABEL_PROP.test(name) && /[A-Za-z]{2,}/.test(literal) && !/^[a-z0-9-]+$/.test(literal)) {
        warnings.push({ rule: 'i18n-literal', line: element.line, message: `<${element.tag} ${name}="${literal}"> hard-codes user-facing English. Pass a translated string from your i18n layer.` });
      }
    }
    for (const prop of component.props.filter((entry) => !entry.part && entry.default && /label/i.test(entry.name))) {
      const names = prop.names || [prop.name];
      const missing = names.filter((name) => /label/i.test(name) && !passed.has(name));
      if (missing.length && /[A-Za-z]{3,}/.test(prop.default)) {
        info.push({ rule: 'i18n-default', line: element.line, message: `<${element.tag}> falls back to English for ${missing.join(', ')} (default "${prop.default}"). Pass localized labels in non-English interfaces.` });
      }
    }
    if (/^(?:Button|IconButton)$/.test(component.import.mainExport) && passed.has('size') && /icon/.test(element.attributes.find((attribute) => attribute.name === 'size')?.literal || '') && !passed.has('aria-label') && !passed.has('aria-labelledby')) {
      errors.push({ rule: 'a11y-name', line: element.line, message: `Icon-only <${element.tag}> needs an accessible name (aria-label).` });
    }
  }

  for (const { value, line } of classStrings(code)) {
    for (const token of value.split(/\s+/).filter(Boolean)) {
      const utility = token.slice(token.lastIndexOf(':') + 1).replace(/^!/, '');
      const physical = utility.match(PHYSICAL_TOKEN);
      if (physical) {
        const negative = utility.startsWith('-') ? '-' : '';
        const logical = `${negative}${PHYSICAL[physical[1]]}${physical[2] ? `-${physical[2]}` : ''}`;
        warnings.push({ rule: 'logical-properties', line, message: `"${token}" is a physical direction class; use "${token.replace(utility, logical)}" so layouts mirror in RTL.` });
      } else if (/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/.test(utility)) {
        warnings.push({ rule: 'raw-color', line, message: `"${token}" hard-codes a colour; use semantic token utilities (see get_tokens("colors")).` });
      } else if (PALETTE.test(utility)) {
        warnings.push({ rule: 'palette-color', line, message: `"${token}" uses a raw palette colour; prefer semantic utilities such as bg-surface, text-text-muted, border-border, bg-accent or the status tones.` });
      } else if (/^space-[xy]-/.test(utility)) {
        info.push({ rule: 'gap', line, message: `"${token}": prefer gap-* on a flex/grid container (density scales with --ds-space-scale).` });
      }
    }
  }

  return {
    valid: errors.length === 0,
    summary: `${errors.length} error(s), ${warnings.length} warning(s), ${info.length} note(s); ${localComponents.size} Gaudi component(s) checked.`,
    errors, warnings, info
  };
}
