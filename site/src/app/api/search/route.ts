import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

// Static index (exported at build time) so search works on any static host.
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source, { language: 'english' });
