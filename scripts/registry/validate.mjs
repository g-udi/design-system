// `pnpm registry:validate` — validates registry.json and every public/r item against the official
// shadcn registry schemas (zod schemas exported by the `shadcn` package). The validator is installed
// on first use into node_modules/.cache/shadcn-schema, so it is not a dependency of Gaudi.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from '../ai/sources.mjs';

const SHADCN = 'shadcn@4.21.1';
const cache = path.join(root, 'node_modules/.cache/shadcn-schema');
const entry = path.join(cache, 'node_modules/shadcn/dist/schema/index.js');
if (!existsSync(entry)) {
  mkdirSync(cache, { recursive: true });
  writeFileSync(path.join(cache, 'package.json'), '{"private":true}\n');
  execFileSync('npm', ['install', SHADCN, '--ignore-scripts', '--no-audit', '--no-fund', '--silent'], { cwd: cache, stdio: 'inherit' });
}
const { registrySchema, registryItemSchema } = await import(pathToFileURL(entry));

const failures = [];
const validate = (schema, file) => {
  const result = schema.safeParse(JSON.parse(readFileSync(path.join(root, file), 'utf8')));
  if (!result.success) failures.push(`${file}: ${result.error.issues.slice(0, 3).map((issue) => `${issue.path.join('.')} ${issue.message}`).join('; ')}`);
};
validate(registrySchema, 'registry.json');
const items = readdirSync(path.join(root, 'public/r')).filter((file) => file.endsWith('.json') && file !== 'registry.json');
for (const file of items) validate(registryItemSchema, `public/r/${file}`);
for (const file of items) {
  const item = JSON.parse(readFileSync(path.join(root, 'public/r', file), 'utf8'));
  // Themes carry cssVars only: no copy-in source and no package dependency.
  if (item.type === 'registry:theme') {
    if (!item.cssVars?.light || !item.cssVars?.dark) failures.push(`public/r/${file}: theme without light/dark cssVars`);
    continue;
  }
  for (const { content } of item.files) {
    if (/from\s+['"]\.{1,2}\//.test(content)) failures.push(`public/r/${file}: relative import left in copy-in source`);
  }
  if (!item.dependencies.some((dependency) => dependency.startsWith('@gaudi/design-system'))) failures.push(`public/r/${file}: missing @gaudi/design-system dependency`);
}
if (failures.length) {
  console.error(failures.slice(0, 20).join('\n'));
  throw new Error(`${failures.length} registry validation failure(s).`);
}
console.log(`Registry valid against ${SHADCN} schemas: registry.json + ${items.length} items; no relative imports, every item depends on @gaudi/design-system.`);
