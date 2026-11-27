import { gzipSync } from 'node:zlib';
import type { Folder, Root } from 'fumadocs-core/page-tree';
import type { AdvancedIndex } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

export function GET() {
  const breadcrumbs = new Map<string, string[]>();
  function visit(folder: Folder | Root, parents: string[]) {
    const path = typeof folder.name === 'string' && folder.name ? [...parents, folder.name] : parents;
    if ('index' in folder && folder.index && !breadcrumbs.has(folder.index.url)) breadcrumbs.set(folder.index.url, path);
    let section = path;
    for (const node of folder.children) {
      if (node.type === 'folder') visit(node, path);
      else if (node.type === 'separator') section = typeof node.name === 'string' && node.name ? [...path, node.name] : path;
      else if (!breadcrumbs.has(node.url)) breadcrumbs.set(node.url, section);
    }
  }
  visit(source.pageTree, []);

  // Ship the documents once. The browser builds the same Fumadocs ranker without transferring
  // its posting lists, document IDs and sorting tables alongside the source text.
  const records: AdvancedIndex[] = source.getPages().map((page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    breadcrumbs: breadcrumbs.get(page.url),
    locale: page.locale,
    structuredData: page.data.structuredData
  }));
  return new Response(new Uint8Array(gzipSync(JSON.stringify(records), { level: 9 })), {
    headers: { 'Content-Type': 'application/gzip' }
  });
}
