import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCsf } from 'storybook/internal/csf-tools';
import { toId } from 'storybook/internal/csf';
import { syncComponentDocs } from './sync-component-docs.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entries = {};
for (const directory of ['src/docs/stories', 'src/components', 'src/docs/hooks/stories']) {
  const files = await readdir(resolve(root, directory), { recursive: true });
  const storyFiles = files.filter(name => /\.stories\.(js|jsx)$/.test(name)).sort((a, b) =>
    Number(/Patterns\.stories/.test(a)) - Number(/Patterns\.stories/.test(b)) || a.localeCompare(b));
  for (const name of storyFiles) {
    const file = resolve(root, directory, name);
    const csf = loadCsf(await readFile(file, 'utf8'), { fileName: file, makeTitle: title => title }).parse();
    for (const story of csf.indexInputs) {
      const id = story.__id;
      entries[id] = { id, title: story.title, name: story.name, type: 'story', tags: story.tags || [], importPath: `./${relative(root, file)}` };
      if (story.tags?.includes('autodocs') && !story.tags.includes('!autodocs')) {
        const docsId = toId(story.metaId || story.title, 'docs');
        entries[docsId] ||= { id: docsId, title: story.title, name: 'Docs', type: 'docs', tags: ['autodocs'], importPath: `./${relative(root, file)}` };
      }
    }
  }
}
const output = `${JSON.stringify({ v: 5, entries }, null, 2)}\n`;
const destination = resolve(root, 'src/docs/catalogue/catalogue.json');
if (process.argv.includes('--check')) {
  if (await readFile(destination, 'utf8') !== output) throw new Error('Catalogue snapshot is stale. Run pnpm catalogue:sync.');
} else {
  await writeFile(destination, output);
}
console.log(`${Object.keys(entries).length} Storybook entries indexed.`);
const documentationCount = await syncComponentDocs({ check: process.argv.includes('--check') });
console.log(`${documentationCount} owner documentation modules indexed.`);
