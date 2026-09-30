// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
export const codeBlockLanguages = {
  bash: () => import('shiki/langs/bash.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
  csharp: () => import('shiki/langs/csharp.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  docker: () => import('shiki/langs/docker.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  graphql: () => import('shiki/langs/graphql.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  kotlin: () => import('shiki/langs/kotlin.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  ruby: () => import('shiki/langs/ruby.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  shell: () => import('shiki/langs/shellscript.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  swift: () => import('shiki/langs/swift.mjs'),
  toml: () => import('shiki/langs/toml.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs')
};
const LANGUAGE_ALIASES = {
  'c++': 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
  dockerfile: 'docker',
  htm: 'html',
  js: 'javascript',
  jsonc: 'json',
  md: 'markdown',
  mdx: 'markdown',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  sh: 'shell',
  shellscript: 'shell',
  ts: 'typescript',
  yml: 'yaml',
  zsh: 'shell'
};
export const codeBlockThemes = {
  'github-light': () => import('shiki/themes/github-light.mjs'),
  'github-dark': () => import('shiki/themes/github-dark.mjs'),
  /**
   * Design-token theming: every token colour becomes a `var(--code-token-*)`
   * reference, so the palette lives in the consumer's stylesheet and follows
   * their themes. Pass as BOTH sides. Variables consumed (prefix `--code-`):
   * foreground, token-constant, token-string, token-comment, token-keyword,
   * token-parameter, token-function, token-string-expression,
   * token-punctuation, token-link.
   */
  'css-variables': async () => {
    const { createCssVariablesTheme } = await import('shiki/core');
    return createCssVariablesTheme({
      name: 'css-variables',
      variablePrefix: '--code-',
      fontStyle: true
    });
  }
};
export const DEFAULT_CODE_BLOCK_THEMES = {
  light: 'github-light',
  dark: 'github-dark'
};
export function resolveCodeBlockLanguage(language) {
  if (!language) return void 0;
  const normalized = language.trim().toLowerCase();
  const resolved = LANGUAGE_ALIASES[normalized] ?? normalized;
  return resolved in codeBlockLanguages ? resolved : void 0;
}
export function parseLineSpec(spec) {
  const out = /* @__PURE__ */ new Set();
  if (!spec) return out;
  if (Array.isArray(spec)) {
    for (const value of spec) {
      if (Number.isInteger(value) && value > 0) out.add(value);
    }
    return out;
  }
  for (const part of spec.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const range = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start > 0 && end >= start) {
        for (let line = start; line <= end; line += 1) out.add(line);
      }
      continue;
    }
    if (/^\d+$/.test(trimmed)) {
      const single = Number(trimmed);
      if (single > 0) out.add(single);
    }
  }
  return out;
}
export function normalizeCode(code) {
  return code.replace(/\r\n?/g, '\n');
}
export function buildWordDecorations(code, words) {
  if (!words?.length) return [];
  const lineStarts = [0];
  for (let index = 0; index < code.length; index += 1) {
    if (code[index] === '\n') lineStarts.push(index + 1);
  }
  const lineAt = (offset) => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (lineStarts[mid] <= offset) low = mid;
      else high = mid - 1;
    }
    return low + 1;
  };
  const taken = [];
  const out = [];
  for (const entry of words) {
    const word = typeof entry === 'string' ? entry : entry.word;
    if (!word) continue;
    const limit =
      typeof entry === 'string' ? void 0 : parseLineSpec(entry.lines);
    let from = code.indexOf(word);
    while (from !== -1) {
      const to = from + word.length;
      const withinLimit = !limit || limit.size === 0 || limit.has(lineAt(from));
      const overlaps = taken.some((r) => from < r.end && to > r.start);
      if (withinLimit && !overlaps) {
        taken.push({ start: from, end: to });
        out.push({ start: from, end: to, properties: { class: 'cb-word' } });
      }
      from = code.indexOf(word, from + word.length);
    }
  }
  return out.sort((a, b) => a.start - b.start);
}
export function stripNotationComments(code) {
  return code
    .split('\n')
    .map((line) =>
      line.replace(
        /\s*(?:\/\/|#|--|;|%|<!--|\/\*)\s*\[!code[^\]]*\]\s*(?:-->|\*\/)?\s*$/,
        ''
      )
    )
    .join('\n');
}
export function toPlainLines(code, startLine = 1) {
  return normalizeCode(code)
    .split('\n')
    .map((text, index) => ({
      tokens: text ? [{ content: text }] : [],
      number: startLine + index,
      text
    }));
}
export function markdownCodeProps(props) {
  let language;
  let code = '';
  const readClassName = (value) => {
    if (typeof value !== 'string') return;
    const match = value.match(/(?:^|\s)language-([\w+#-]+)/);
    if (match && !language) language = match[1];
  };
  const walk = (node) => {
    if (node === null || node === void 0 || node === false) return;
    if (typeof node === 'string') {
      code += node;
      return;
    }
    if (typeof node === 'number') {
      code += String(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const child of node) walk(child);
      return;
    }
    if (typeof node === 'object' && 'props' in node) {
      const nodeProps = node.props;
      if (!nodeProps) return;
      readClassName(nodeProps.className);
      walk(nodeProps.children);
    }
  };
  readClassName(props.className);
  walk(props.children);
  return { code: code.replace(/\n$/, ''), language };
}
export function markdownFences(markdown) {
  const parts = [];
  const lines = markdown.split('\n');
  let inFence = false;
  let opener = '';
  let language;
  let buffer = [];
  const flushText = () => {
    const text = buffer.join('\n').trim();
    if (text) parts.push({ type: 'text', content: text, open: false });
    buffer = [];
  };
  const flushCode = (open) => {
    parts.push({
      type: 'code',
      content: buffer.join('\n'),
      language,
      open
    });
    buffer = [];
    language = void 0;
  };
  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})([\w+#-]*)\s*$/);
    if (fence && !inFence) {
      flushText();
      inFence = true;
      opener = fence[1];
      language = fence[2] || void 0;
      continue;
    }
    if (
      fence &&
      inFence &&
      fence[1][0] === opener[0] &&
      fence[1].length >= opener.length &&
      !fence[2]
    ) {
      flushCode(false);
      inFence = false;
      continue;
    }
    buffer.push(line);
  }
  if (inFence) flushCode(true);
  else flushText();
  return parts;
}
let highlighterPromise = null;
const loadedLanguages = /* @__PURE__ */ new Set();
const loadedThemes = /* @__PURE__ */ new Set();
async function loadHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
        await Promise.all([
          import('shiki/core'),
          import('shiki/engine/javascript')
        ]);
      return await createHighlighterCore({
        themes: [],
        langs: [],
        engine: createJavaScriptRegexEngine({ forgiving: true })
      });
    })();
  }
  return highlighterPromise;
}
const warnedThemes = /* @__PURE__ */ new Set();
async function ensureTheme(highlighter, name, side = 'light') {
  const resolved =
    name in codeBlockThemes ? name : DEFAULT_CODE_BLOCK_THEMES[side];
  if (
    resolved !== name &&
    process.env.NODE_ENV !== 'production' &&
    !warnedThemes.has(name)
  ) {
    warnedThemes.add(name);
    console.warn(
      `[code-block] Unknown theme "${name}" - falling back to "${resolved}". Register it in codeBlockThemes to use it.`
    );
  }
  if (loadedThemes.has(resolved)) return resolved;
  await highlighter.loadTheme(await codeBlockThemes[resolved]());
  loadedThemes.add(resolved);
  return resolved;
}
async function ensureLanguage(highlighter, language) {
  if (loadedLanguages.has(language)) return;
  const loader = codeBlockLanguages[language];
  if (!loader) return;
  await highlighter.loadLanguage(await loader());
  loadedLanguages.add(language);
}
const FONT_STYLE_BY_DECLARATION = {
  'font-style:italic': 'italic',
  'font-weight:bold': 'bold',
  'text-decoration:underline': 'underline'
};
function readTokenStyle(style) {
  if (typeof style !== 'string') return {};
  const out = {};
  for (const declaration of style.split(';')) {
    const trimmed = declaration.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf(':');
    if (separator === -1) continue;
    const property = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (property === 'color') out.color = value;
    else if (property === '--shiki-dark') out.colorDark = value;
    else {
      const fontStyle = FONT_STYLE_BY_DECLARATION[`${property}:${value}`];
      if (fontStyle) out.fontStyle = fontStyle;
    }
  }
  return out;
}
function classListOf(node) {
  const value = node.properties?.class ?? node.properties?.className;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  return [];
}
function stateFromClasses(classes) {
  const state = {};
  if (classes.includes('highlighted')) state.highlighted = true;
  if (classes.includes('focused')) state.focused = true;
  if (classes.includes('diff')) {
    if (classes.includes('add')) state.diff = 'add';
    else if (classes.includes('remove')) state.diff = 'remove';
  }
  for (const level of ['error', 'warning', 'info']) {
    if (classes.includes(level)) state.level = level;
  }
  return Object.keys(state).length ? state : void 0;
}
function collectTokens(node, out, inWord) {
  for (const child of node.children ?? []) {
    if (child.type === 'text') {
      if (!child.value) continue;
      out.push(
        inWord ? { content: child.value, word: true } : { content: child.value }
      );
      continue;
    }
    if (child.type !== 'element') continue;
    const classes = classListOf(child);
    const childInWord = inWord || classes.includes('cb-word');
    const style = readTokenStyle(child.properties?.style);
    const hasStyle = Boolean(style.color || style.colorDark || style.fontStyle);
    const onlyText = (child.children ?? []).every(
      (grandChild) => grandChild.type === 'text'
    );
    if (hasStyle && onlyText) {
      const content = (child.children ?? []).map((c) => c.value ?? '').join('');
      if (!content) continue;
      out.push({
        content,
        ...style,
        ...(childInWord ? { word: true } : {})
      });
      continue;
    }
    collectTokens(child, out, childInWord);
  }
}
function findCodeElement(root) {
  if (root.type === 'element' && root.tagName === 'code') return root;
  for (const child of root.children ?? []) {
    const found = findCodeElement(child);
    if (found) return found;
  }
  return void 0;
}
const MAX_TRACKED_DOCUMENTS = 24;
const previousDocuments = /* @__PURE__ */ new Map();
function sameLine(a, b) {
  if (a.number !== b.number || a.text !== b.text) return false;
  if (a.tokens.length !== b.tokens.length) return false;
  if (JSON.stringify(a.state ?? null) !== JSON.stringify(b.state ?? null)) {
    return false;
  }
  for (let index = 0; index < a.tokens.length; index += 1) {
    const left = a.tokens[index];
    const right = b.tokens[index];
    if (
      left.content !== right.content ||
      left.color !== right.color ||
      left.colorDark !== right.colorDark ||
      left.fontStyle !== right.fontStyle ||
      left.word !== right.word
    ) {
      return false;
    }
  }
  return true;
}
function reuseUnchangedLines(key, next) {
  const previous = previousDocuments.get(key);
  if (previous) {
    for (let index = 0; index < next.length; index += 1) {
      const before = previous[index];
      if (before && sameLine(before, next[index])) next[index] = before;
    }
  }
  previousDocuments.set(key, next);
  if (previousDocuments.size > MAX_TRACKED_DOCUMENTS) {
    const oldest = previousDocuments.keys().next().value;
    if (oldest !== void 0) previousDocuments.delete(oldest);
  }
  return next;
}
function applyPropState(lines, options) {
  const highlighted = parseLineSpec(options.highlightedLines);
  const focused = parseLineSpec(options.focusedLines);
  const added = parseLineSpec(options.diff?.added);
  const removed = parseLineSpec(options.diff?.removed);
  const levels = {
    error: parseLineSpec(options.lineLevels?.error),
    warning: parseLineSpec(options.lineLevels?.warning),
    info: parseLineSpec(options.lineLevels?.info)
  };
  lines.forEach((line, index) => {
    const source = index + 1;
    const state = { ...line.state };
    if (highlighted.has(source)) state.highlighted = true;
    if (focused.has(source)) state.focused = true;
    if (added.has(source)) state.diff = 'add';
    else if (removed.has(source)) state.diff = 'remove';
    for (const level of ['error', 'warning', 'info']) {
      if (levels[level].has(source)) state.level = level;
    }
    line.state = Object.keys(state).length ? state : void 0;
  });
}
export async function highlightCode(code, options = {}) {
  const source = normalizeCode(code);
  const startLine = options.startLine ?? 1;
  const language = resolveCodeBlockLanguage(options.language);
  if (!language) return toPlainLines(source, startLine);
  const themes = options.themes ?? DEFAULT_CODE_BLOCK_THEMES;
  const signature = JSON.stringify([
    options.instanceKey ?? null,
    language,
    themes,
    startLine,
    options.highlightedLines ?? null,
    options.highlightedWords ?? null,
    options.focusedLines ?? null,
    options.diff ?? null,
    options.lineLevels ?? null,
    (options.transformers ?? []).length
  ]);
  let root;
  try {
    const highlighter = await loadHighlighter();
    const [light, dark] = await Promise.all([
      ensureTheme(highlighter, themes.light),
      ensureTheme(highlighter, themes.dark)
    ]);
    await ensureLanguage(highlighter, language);
    root = highlighter.codeToHast(source, {
      lang: language,
      themes: { light, dark },
      defaultColor: 'light',
      cssVariablePrefix: '--shiki-',
      decorations: buildWordDecorations(source, options.highlightedWords),
      ...(options.transformers?.length
        ? { transformers: options.transformers }
        : {})
    });
  } catch {
    return toPlainLines(source, startLine);
  }
  const codeElement = findCodeElement(root);
  if (!codeElement) return toPlainLines(source, startLine);
  const lines = [];
  for (const child of codeElement.children ?? []) {
    if (child.type !== 'element') continue;
    const tokens = [];
    collectTokens(child, tokens, false);
    lines.push({
      tokens,
      number: startLine + lines.length,
      text: tokens.map((token) => token.content).join(''),
      state: stateFromClasses(classListOf(child))
    });
  }
  if (!lines.length) return toPlainLines(source, startLine);
  applyPropState(lines, options);
  return reuseUnchangedLines(signature, lines);
}
export function resetCodeBlockHighlighter() {
  highlighterPromise = null;
  loadedLanguages.clear();
  loadedThemes.clear();
  previousDocuments.clear();
}
const ANSI_SLOTS = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'bright-black',
  'bright-red',
  'bright-green',
  'bright-yellow',
  'bright-blue',
  'bright-magenta',
  'bright-cyan',
  'bright-white'
];
const ANSI_LIGHT = [
  '#3f3f46',
  '#dc2626',
  '#16a34a',
  '#a16207',
  '#2563eb',
  '#9333ea',
  '#0891b2',
  '#a1a1aa',
  '#52525b',
  '#ef4444',
  '#22c55e',
  '#ca8a04',
  '#3b82f6',
  '#a855f7',
  '#06b6d4',
  '#a1a1aa'
];
const ANSI_DARK = [
  '#a1a1aa',
  '#f87171',
  '#4ade80',
  '#facc15',
  '#60a5fa',
  '#c084fc',
  '#22d3ee',
  '#e4e4e7',
  '#a1a1aa',
  '#fca5a5',
  '#86efac',
  '#fde047',
  '#93c5fd',
  '#d8b4fe',
  '#67e8f9',
  '#fafafa'
];
const ansiVar = (slot, fallback) =>
  `var(--code-ansi-${ANSI_SLOTS[slot]}, ${fallback})`;
function ansi256(index) {
  if (index < 16) return ANSI_DARK[index];
  if (index >= 232) {
    const v = 8 + (index - 232) * 10;
    const h = v.toString(16).padStart(2, '0');
    return `#${h}${h}${h}`;
  }
  const cube = [0, 95, 135, 175, 215, 255];
  const n = index - 16;
  const to = (v) => cube[v].toString(16).padStart(2, '0');
  return `#${to(Math.floor(n / 36))}${to(Math.floor(n / 6) % 6)}${to(n % 6)}`;
}
// ANSI escape codes are intentionally matched and stripped from terminal output.
// eslint-disable-next-line no-control-regex
const SGR_RE = /\x1b\[([0-9;]*)m/g;
const OTHER_ESCAPES_RE =
  // Terminal escape sequences are the data this parser consumes.
  // eslint-disable-next-line no-control-regex
  /\x1b(?:\[(?![0-9;]*m)[0-9;?]*[A-Za-z]|\][^\x07]*(?:\x07|\x1b\\)|[()][0-9A-B])/g;
export function ansiToLines(text, startLine = 1) {
  const clean = normalizeCode(text).replace(OTHER_ESCAPES_RE, '');
  return clean.split('\n').map((raw, index) => {
    const tokens = [];
    const style = {};
    let plain = '';
    let last = 0;
    const flush = (content) => {
      if (!content) return;
      const fontStyle = style.bold
        ? 'bold'
        : style.italic
          ? 'italic'
          : style.underline
            ? 'underline'
            : void 0;
      tokens.push({
        content,
        color: style.color,
        colorDark: style.colorDark,
        fontStyle
      });
    };
    SGR_RE.lastIndex = 0;
    let match;
    while ((match = SGR_RE.exec(raw)) !== null) {
      flush(raw.slice(last, match.index));
      plain += raw.slice(last, match.index);
      last = match.index + match[0].length;
      const params = (match[1] || '0').split(';').map(Number);
      for (let i = 0; i < params.length; i += 1) {
        const code = params[i];
        if (code === 0) {
          delete style.color;
          delete style.colorDark;
          style.bold = style.italic = style.underline = false;
        } else if (code === 1) style.bold = true;
        else if (code === 3) style.italic = true;
        else if (code === 4) style.underline = true;
        else if (code === 22) style.bold = false;
        else if (code === 23) style.italic = false;
        else if (code === 24) style.underline = false;
        else if (code === 39) {
          delete style.color;
          delete style.colorDark;
        } else if (code >= 30 && code <= 37) {
          style.color = ansiVar(code - 30, ANSI_LIGHT[code - 30]);
          style.colorDark = ansiVar(code - 30, ANSI_DARK[code - 30]);
        } else if (code >= 90 && code <= 97) {
          style.color = ansiVar(code - 82, ANSI_LIGHT[code - 82]);
          style.colorDark = ansiVar(code - 82, ANSI_DARK[code - 82]);
        } else if (code === 38 && params[i + 1] === 5) {
          const hex = ansi256(params[i + 2] ?? 0);
          style.color = style.colorDark = hex;
          i += 2;
        } else if (code === 38 && params[i + 1] === 2) {
          const [r, g, b] = [
            params[i + 2] ?? 0,
            params[i + 3] ?? 0,
            params[i + 4] ?? 0
          ];
          const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
          style.color = style.colorDark = hex;
          i += 4;
        } else if (
          code === 48 &&
          (params[i + 1] === 5 || params[i + 1] === 2)
        ) {
          i += params[i + 1] === 5 ? 2 : 4;
        }
      }
    }
    flush(raw.slice(last));
    plain += raw.slice(last);
    return { number: startLine + index, text: plain, tokens };
  });
}
export function parseUnifiedDiff(patch) {
  const files = [];
  let current = null;
  let oldNumber = 0;
  let newNumber = 0;
  let width = 4;
  const push = (text, state, gutter) => {
    if (!current) return;
    current.lines.push({
      number: current.lines.length + 1,
      text,
      tokens: [{ content: text }],
      state,
      gutter
    });
  };
  const pad = (value) => (value === null ? '' : String(value)).padStart(width);
  for (const raw of normalizeCode(patch).split('\n')) {
    const fileHeader = raw.match(/^diff --git a\/(.+) b\/(.+)$/);
    const plusHeader = raw.match(/^\+\+\+ (?:b\/)?(.+)$/);
    if (fileHeader || plusHeader) {
      const name = fileHeader ? fileHeader[2] : plusHeader[1];
      if (name !== '/dev/null' && (!current || current.file !== name)) {
        current = { file: name, lines: [], added: 0, removed: 0, hunks: [] };
        files.push(current);
      }
      continue;
    }
    if (
      /^(---|index |old mode|new mode|new file|deleted file|similarity|rename |Binary )/.test(
        raw
      )
    ) {
      continue;
    }
    const hunk = raw.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/);
    if (hunk && current) {
      oldNumber = Number(hunk[1]);
      newNumber = Number(hunk[3]);
      width = Math.max(
        String(oldNumber + Number(hunk[2] ?? 0)).length,
        String(newNumber + Number(hunk[4] ?? 0)).length,
        2
      );
      current.hunks.push({ header: raw, at: current.lines.length + 1 });
      push(
        hunk[5].trim() || raw,
        { level: 'info' },
        `${'\xB7'.padStart(width)} ${'\xB7'.padStart(width)}`
      );
      continue;
    }
    if (!current || (!raw && files.length === 0)) continue;
    if (raw.startsWith('+')) {
      push(raw.slice(1), { diff: 'add' }, `${pad(null)} ${pad(newNumber)}`);
      newNumber += 1;
      current.added += 1;
    } else if (raw.startsWith('-')) {
      push(raw.slice(1), { diff: 'remove' }, `${pad(oldNumber)} ${pad(null)}`);
      oldNumber += 1;
      current.removed += 1;
    } else if (raw.startsWith(' ') || raw === '') {
      if (current.lines.length === 0 && raw === '') continue;
      push(raw.slice(1), void 0, `${pad(oldNumber)} ${pad(newNumber)}`);
      oldNumber += 1;
      newNumber += 1;
    }
  }
  return files;
}
