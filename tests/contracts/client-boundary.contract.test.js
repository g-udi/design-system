import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

/*
 * In React Server Components every export of a 'use client' module becomes a client reference on
 * the server: a constant reads as a function, a variant map loses its keys, and a helper cannot be
 * called. Public entries may therefore expose only components (PascalCase) and hooks (use*) through
 * a client module; constants, variant maps and helpers must come from a server-safe sibling.
 */

const root = fileURLToPath(new URL('../..', import.meta.url));
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

// Client-only by nature: `toast` is only meaningful in a browser event handler, and the animated
// icon registry maps names to lazy client artwork that only AnimatedIcon renders (its server-safe
// names and sources are `animatedIconMetadata`).
const clientOnlyValues = new Set([ 'animatedIconRegistry', 'toast' ]);

const sources = new Map();
const read = (file) => {
  if (!sources.has(file)) {
    const text = readFileSync(file, 'utf8');
    const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    sources.set(file, { client: /^\s*(?:(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*)\s*)*['"]use client['"]/.test(text), code });
  }
  return sources.get(file);
};

const resolveImport = (from, specifier) => {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(from), specifier);
  for (const candidate of [ base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx') ]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  throw new Error(`${path.relative(root, from)}: cannot resolve ${specifier}`);
};

const specifiers = (list) => list.split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
  const [ local, exported = local ] = part.split(/\s+as\s+/).map((name) => name.trim());
  return { exported, local };
});

/** Maps every exported name of a module to { file, name } of its next hop, or { origin } when declared locally. */
const exportTable = (file) => {
  const { code } = read(file);
  const imports = new Map();
  for (const [ , clause, from ] of code.matchAll(/^import\s+([^'";]+?)\s+from\s+['"]([^'"]+)['"]/gm)) {
    const named = clause.match(/\{([^}]*)\}/)?.[1];
    if (named) for (const { local, exported } of specifiers(named)) imports.set(exported, { from, name: local });
    const fallback = clause.replace(/\{[^}]*\}/, '').replace(/,/g, ' ').trim();
    if (fallback && !fallback.startsWith('*')) imports.set(fallback, { from, name: 'default' });
  }
  const table = new Map();
  const stars = [];
  for (const [ , names, from ] of code.matchAll(/^export\s*\{([^}]*)\}\s*(?:from\s*['"]([^'"]+)['"])?/gm)) {
    for (const { local, exported } of specifiers(names)) {
      if (from) table.set(exported, { from, name: local });
      else table.set(exported, imports.get(local) || { origin: true });
    }
  }
  for (const [ , from ] of code.matchAll(/^export\s+\*\s+from\s+['"]([^'"]+)['"]/gm)) stars.push(from);
  for (const [ , name ] of code.matchAll(/^export\s+(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/gm)) table.set(name, { origin: true });
  if (/^export\s+default\b/m.test(code)) table.set('default', { origin: true });
  return { stars, table };
};

/** Returns the public names of a module with the first 'use client' module on each re-export chain. */
const publicNames = (file, seen = new Set()) => {
  if (seen.has(file)) return new Map();
  seen.add(file);
  const { stars, table } = exportTable(file);
  const names = new Map();
  const boundaryOf = (target, name, visited = new Set()) => {
    if (read(target).client) return target;
    const key = `${target}#${name}`;
    if (visited.has(key)) return null;
    visited.add(key);
    const { stars: nested, table: entries } = exportTable(target);
    const hop = entries.get(name);
    if (hop?.origin) return null;
    if (hop) {
      const next = resolveImport(target, hop.from);
      return next ? boundaryOf(next, hop.name, visited) : null;
    }
    for (const from of nested) {
      const next = resolveImport(target, from);
      if (next && (exportTable(next).table.has(name) || exportTable(next).stars.length)) {
        const found = boundaryOf(next, name, visited);
        if (found) return found;
      }
    }
    return null;
  };
  const clientFile = read(file).client ? file : null;
  for (const [ exported, hop ] of table) {
    if (hop.origin) { names.set(exported, clientFile); continue; }
    const next = resolveImport(file, hop.from);
    names.set(exported, clientFile || (next ? boundaryOf(next, hop.name) : null));
  }
  for (const from of stars) {
    const next = resolveImport(file, from);
    if (!next) continue;
    for (const [ exported, boundary ] of publicNames(next, new Set(seen))) {
      if (exported !== 'default' && !names.has(exported)) names.set(exported, clientFile || boundary);
    }
  }
  return names;
};

const isComponentOrHook = (name) => (/^[A-Z]/.test(name) && !/^[A-Z][A-Z0-9_]+$/.test(name)) || /^use[A-Z]/.test(name) || name === 'default';

test('public entries expose only components and hooks through client modules', () => {
  const entries = Object.entries(manifest.exports)
    .map(([ subpath, target ]) => [ subpath, typeof target === 'string' ? target : target.import || target.default ])
    .filter(([ , target ]) => /\.jsx?$/.test(target));
  assert.ok(entries.length > 100, 'The boundary check must inspect the full public export map');
  const failures = [];
  for (const [ subpath, target ] of entries) {
    for (const [ name, boundary ] of publicNames(path.join(root, target))) {
      if (boundary && !isComponentOrHook(name) && !clientOnlyValues.has(name)) {
        failures.push(`${subpath}: ${name} is a client reference from ${path.relative(root, boundary)}`);
      }
    }
  }
  assert.deepEqual([ ...new Set(failures) ], [], failures.join('\n'));
});

test('the boundary check recognises the server-safe pagination constant', () => {
  const names = publicNames(path.join(root, 'src/components/core/Pagination/index.js'));
  assert.equal(names.get('POSTS_PER_PAGE'), null);
  assert.ok(names.get('Pagination'), 'Pagination itself is a client component');
});
