import type { AdvancedIndex, SearchServer } from 'fumadocs-core/search/server';
import { basePath } from './nav';

async function readCorpus(): Promise<AdvancedIndex[]> {
  const response = await fetch(`${basePath}/api/search-corpus.gz`);
  if (!response.ok) throw new Error(`Could not load the documentation search index (${response.status}).`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const data = new Blob([bytes]);
  // Static hosts may already serve .gz with Content-Encoding: gzip, which fetch decodes.
  const body = bytes[0] === 0x1f && bytes[1] === 0x8b ? data.stream().pipeThrough(new DecompressionStream('gzip')) : data;
  return new Response(body).json();
}

let database: Promise<SearchServer> | undefined;
let legacyAttempt = 0;
export const docsSearchClient = {
  async search(query: string) {
    if (typeof DecompressionStream === 'undefined') {
      const { staticClient } = await import('fumadocs-core/search/client/orama-static');
      const attempt = legacyAttempt;
      const from = `${basePath}/api/search${attempt ? `?retry=${attempt}` : ''}`;
      try {
        return await staticClient({ from }).search(query);
      } catch (error) {
        // Fumadocs caches a rejected index load by URL. Give the next attempt a fresh cache key.
        if (attempt === legacyAttempt) legacyAttempt++;
        throw error;
      }
    }
    database ??= Promise.all([readCorpus(), import('fumadocs-core/search/server')])
      .then(([indexes, { initAdvancedSearch }]) => initAdvancedSearch({ indexes, language: 'english' }))
      .catch((error) => {
        database = undefined;
        throw error;
      });
    return (await database).search(query);
  }
};
