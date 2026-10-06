// Minimal CSS reader for theme files: returns every rule's selector (with its enclosing at-rules)
// and its custom-property declarations. Enough for shadcn/tweakcn/StyleGlide exports and tokens.css;
// not a general CSS parser.

/** parseCssBlocks(css) → [{ selector, parents: ['@layer base', …], declarations: { '--name': 'value' } }] */
export function parseCssBlocks(css) {
  const source = String(css).replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [];
  const stack = [];
  let buffer = '';
  let quote = null;
  let depthParen = 0;
  const flushDeclarations = () => {
    const top = stack[stack.length - 1];
    if (top && buffer.trim()) {
      for (const part of splitDeclarations(buffer)) {
        const index = part.indexOf(':');
        if (index < 0) continue;
        const name = part.slice(0, index).trim();
        const value = part.slice(index + 1).trim();
        if (name.startsWith('--') && value) top.declarations[name] = value;
      }
    }
    buffer = '';
  };
  for (const char of source) {
    if (quote) { buffer += char; if (char === quote) quote = null; continue; }
    if (char === '"' || char === "'") { quote = char; buffer += char; continue; }
    if (char === '(') depthParen += 1;
    if (char === ')') depthParen = Math.max(0, depthParen - 1);
    if (char === '{' && depthParen === 0) {
      // Declarations before a nested rule belong to the parent; the text after the last ';' is the prelude.
      const cut = buffer.lastIndexOf(';');
      const prelude = buffer.slice(cut + 1).trim();
      buffer = buffer.slice(0, cut + 1);
      flushDeclarations();
      const block = { selector: prelude, parents: stack.map((entry) => entry.selector), declarations: {} };
      stack.push(block);
      blocks.push(block);
    } else if (char === '}' && depthParen === 0) {
      flushDeclarations();
      stack.pop();
    } else buffer += char;
  }
  return blocks;
}

function splitDeclarations(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ';' && depth === 0) { parts.push(current); current = ''; } else current += char;
  }
  if (current.trim()) parts.push(current);
  return parts;
}
